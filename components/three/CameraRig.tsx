import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { HOME_CAMERA, sceneObjects, type Vec3 } from "@/data/sceneObjects";
import { studio, useStudio } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Camera flights should finish on time even when frames are slow (weak GPUs),
// instead of GSAP stretching them out to smooth over lag.
gsap.ticker.lagSmoothing(0);

const HOME_TARGET = new THREE.Vector3(...HOME_CAMERA.target);
const HOME_DIRECTION = new THREE.Vector3(...HOME_CAMERA.position).sub(HOME_TARGET).normalize();
const HOME_DISTANCE = new THREE.Vector3(...HOME_CAMERA.position).distanceTo(HOME_TARGET);
// On portrait phones look down a bit more steeply (~40° instead of ~25°) so the
// room fills more of the tall screen instead of floating in empty space.
const PORTRAIT_DIRECTION = new THREE.Vector3(9.5, 11.5, 9.9).normalize();

/** Pull a shot back along its view direction so narrow (portrait) screens still fit the subject. */
function fitShot(position: Vec3, target: Vec3, aspect: number) {
  const t = new THREE.Vector3(...target);
  const offset = new THREE.Vector3(...position).sub(t);
  offset.multiplyScalar(Math.max(1, 0.95 / aspect));
  const p = offset.add(t);
  // Stay inside the room (walls at x = -3.5 and z = -3.5).
  p.x = Math.max(p.x, -3.3);
  p.z = Math.max(p.z, -3.3);
  p.y = Math.min(p.y, 3.3);
  return { position: p, target: t };
}

/** Screen-space shift (px) that keeps the focused object clear of the overlay panel. */
function panelOffset(width: number, height: number) {
  if (width >= 768) {
    // matches the panel's md:w-[min(34rem,46vw)] + right gap
    const panel = Math.min(544, width * 0.46) + 20;
    return { x: panel / 2, y: 0 };
  }
  return { x: 0, y: height * 0.64 * 0.45 };
}

/**
 * Home view with pointer parallax; GSAP flies the camera to the opened
 * object and back. Reduced motion → instant cuts, no parallax.
 */
export function CameraRig() {
  const reduced = useReducedMotion();
  const active = useStudio((s) => s.active);
  const night = useStudio((s) => s.night);
  const { camera, size, setFrameloop, invalidate } = useThree();
  const aspect = size.width / size.height;

  // While a panel is open the room is just a still backdrop, so stop rendering
  // every frame once the camera has arrived. This keeps scrolling the panel smooth.
  const settleTimer = useRef<number | undefined>(undefined);
  const wake = (ms: number) => {
    window.clearTimeout(settleTimer.current);
    setFrameloop("always");
    settleTimer.current = window.setTimeout(() => {
      if (studio.getState().active) {
        setFrameloop("demand");
        invalidate();
      }
    }, ms);
  };
  useEffect(() => () => window.clearTimeout(settleTimer.current), []);
  // day/night fade needs live frames
  useEffect(() => {
    if (active) wake(2200);
  }, [night]);

  const home = useMemo(
    () =>
      (aspect < 1 ? PORTRAIT_DIRECTION : HOME_DIRECTION)
        .clone()
        .multiplyScalar(Math.max(HOME_DISTANCE, 17 / aspect))
        .add(HOME_TARGET),
    [aspect],
  );

  // Animated values (mutated by GSAP, read every frame).
  const anim = useRef({
    position: home.clone(),
    target: HOME_TARGET.clone(),
    parallax: 1,
    offsetX: 0,
    offsetY: 0,
  });
  const pointer = useRef(new THREE.Vector2());

  useEffect(() => {
    const a = anim.current;
    const shot = active
      ? fitShot(sceneObjects[active].camera.position, sceneObjects[active].camera.target, aspect)
      : { position: home, target: HOME_TARGET };
    const offset = active ? panelOffset(size.width, size.height) : { x: 0, y: 0 };
    const duration = reduced ? 0 : 1.4;
    const ease = "power3.inOut";

    // live frames for the flight (+ a little extra for the panel to settle), then freeze if a panel is open
    wake(duration * 1000 + 600);
    const tl = gsap.timeline({ defaults: { duration, ease } });
    tl.to(a.position, { x: shot.position.x, y: shot.position.y, z: shot.position.z }, 0)
      .to(a.target, { x: shot.target.x, y: shot.target.y, z: shot.target.z }, 0)
      .to(a, { parallax: active ? 0 : 1, offsetX: offset.x, offsetY: offset.y }, 0);
    return () => {
      tl.kill();
    };
  }, [active, home, aspect, size.width, size.height, reduced]);

  useFrame((state, dt) => {
    const a = anim.current;
    const k = reduced ? 0 : a.parallax;
    pointer.current.x = THREE.MathUtils.damp(pointer.current.x, state.pointer.x * k, 4, dt);
    pointer.current.y = THREE.MathUtils.damp(pointer.current.y, state.pointer.y * k, 4, dt);

    camera.position.set(
      a.position.x + pointer.current.x * 0.6,
      a.position.y + pointer.current.y * 0.35,
      a.position.z - pointer.current.x * 0.6,
    );
    camera.lookAt(a.target);

    // Keep the view offset permanently on (0 when no panel is open) rather than
    // toggling it: switching it on/off made the effects pipeline draw one frame
    // with mismatched buffers, a half-black flash when a panel opened or closed.
    (camera as THREE.PerspectiveCamera).setViewOffset(size.width, size.height, a.offsetX, a.offsetY, size.width, size.height);
  });

  return null;
}
