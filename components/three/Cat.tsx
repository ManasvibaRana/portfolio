import { useEffect, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { purr } from "@/lib/lofi";
import { palette } from "@/lib/palette";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Mat } from "./Mat";

const FUR = "#f7c59f";
const FUR_DARK = "#eba877";
const Z_COUNT = 3;
/** Seconds without mouse movement before the cat dozes off again. */
const DOZE_AFTER = 4;
/** Seconds of happy wiggle after a click (matches the meow + purr). */
const HAPPY_FOR = 2.6;

const headWorld = new THREE.Vector3();

/** A "Z" built from three thin bars. */
function ZLetter({ material }: { material: THREE.Material }) {
  return (
    <group>
      <mesh position={[0, 0.03, 0]} material={material} userData={{ noShadow: true }}>
        <boxGeometry args={[0.06, 0.012, 0.004]} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI / 4]} material={material} userData={{ noShadow: true }}>
        <boxGeometry args={[0.08, 0.012, 0.004]} />
      </mesh>
      <mesh position={[0, -0.03, 0]} material={material} userData={{ noShadow: true }}>
        <boxGeometry args={[0.06, 0.012, 0.004]} />
      </mesh>
    </group>
  );
}

/**
 * Cat curled up on the beanbag. It wakes up and follows the cursor with its
 * head while the mouse moves, dozes off when it stops, and meows when clicked.
 */
export function Cat({ position }: { position: [number, number, number] }) {
  const reduced = useReducedMotion();
  const body = useRef<THREE.Mesh>(null);
  const head = useRef<THREE.Group>(null);
  const openEyes = useRef<THREE.Group>(null);
  const sleepyEyes = useRef<THREE.Group>(null);
  const zs = useRef<Array<THREE.Group | null>>([]);
  const zMaterials = useRef(
    Array.from({ length: Z_COUNT }, () => new THREE.MeshBasicMaterial({ color: palette.plumSoft, transparent: true, depthWrite: false })),
  );
  const lastPointer = useRef(new THREE.Vector2(9, 9));
  const lastMove = useRef(-100);
  const happyUntil = useRef(-100);
  const happyRequested = useRef(false);
  const awake = useRef(0); // 0 asleep, 1 awake (eased)

  useEffect(() => {
    const materials = zMaterials.current;
    return () => materials.forEach((m) => m.dispose());
  }, []);

  // turn (yaw) first, then lift, so looking up/down stays upright
  useEffect(() => {
    if (head.current) head.current.rotation.order = "YZX";
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const motion = reduced ? 0 : 1;
    if (happyRequested.current) {
      happyRequested.current = false;
      happyUntil.current = t + HAPPY_FOR;
    }

    // any mouse movement wakes the cat up
    if (!state.pointer.equals(lastPointer.current)) {
      lastPointer.current.copy(state.pointer);
      lastMove.current = t;
    }
    const happy = t < happyUntil.current;
    const watching = happy || t - lastMove.current < DOZE_AFTER;
    awake.current = THREE.MathUtils.damp(awake.current, watching ? 1 : 0, 5, dt);
    const isAwake = awake.current > 0.5;

    if (openEyes.current) openEyes.current.visible = isAwake;
    if (sleepyEyes.current) sleepyEyes.current.visible = !isAwake;
    if (body.current) body.current.scale.y = 0.55 + Math.sin(t * (isAwake ? 2.4 : 1.4)) * 0.025 * motion;

    if (head.current) {
      // where is the cursor relative to the cat's head, on screen?
      head.current.getWorldPosition(headWorld).project(state.camera);
      const dx = state.pointer.x - headWorld.x;
      const dy = state.pointer.y - headWorld.y;
      const w = awake.current;
      const yaw = THREE.MathUtils.clamp(dx * 1.4, -1, 1) * w;
      const lift = (THREE.MathUtils.clamp(dy * 1.1, -0.35, 0.7) + 0.15) * w;
      const tilt = happy ? Math.sin(t * 9) * 0.18 * motion : 0;
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, yaw, 8, dt);
      head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, lift, 8, dt);
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, tilt, 10, dt);
    }

    // Zs drift up and fade while asleep
    zs.current.forEach((z, i) => {
      if (!z) return;
      const p = reduced ? 0.5 : (t * 0.35 + i / Z_COUNT) % 1;
      z.position.set(0.28 + p * 0.12, 0.2 + p * 0.38, 0.02 + Math.sin(p * 6 + i) * 0.03);
      z.scale.setScalar(0.6 + p * 0.7);
      zMaterials.current[i].opacity = Math.sin(p * Math.PI) * 0.85 * (1 - awake.current);
    });
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    happyRequested.current = true; // picked up on the next frame, in clock time
    void purr();
  };

  return (
    <group
      position={position}
      rotation={[0, -0.5, 0]}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      {/* curled body */}
      <mesh ref={body} position={[0, 0.08, 0]} scale={[1.25, 0.55, 1]}>
        <sphereGeometry args={[0.2, 24, 16]} />
        <Mat color={FUR} />
      </mesh>
      {/* tail wrapped around the body */}
      <mesh position={[-0.02, 0.04, 0.02]} rotation={[-Math.PI / 2, 0, 0.6]}>
        <torusGeometry args={[0.21, 0.035, 8, 24, Math.PI * 1.1]} />
        <Mat color={FUR_DARK} />
      </mesh>
      {/* head (yaw first, then lift) */}
      <group ref={head} position={[0.2, 0.1, 0.08]}>
        <mesh scale={[1, 0.88, 0.95]}>
          <sphereGeometry args={[0.11, 20, 16]} />
          <Mat color={FUR} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[0.02, 0.09, s * 0.055]} rotation={[s * 0.35, 0, -0.2]}>
            <coneGeometry args={[0.04, 0.07, 4]} />
            <Mat color={FUR_DARK} flatShading />
          </mesh>
        ))}
        {/* open eyes with a sparkle */}
        <group ref={openEyes} visible={false}>
          {[-1, 1].map((s) => (
            <group key={s} position={[0.094, 0.018, s * 0.04]}>
              <mesh scale={[0.6, 1.25, 1]}>
                <sphereGeometry args={[0.016, 12, 10]} />
                <meshBasicMaterial color={palette.plum} />
              </mesh>
              <mesh position={[0.009, 0.006, -0.004]}>
                <sphereGeometry args={[0.005, 8, 6]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
        </group>
        {/* sleepy closed eyes */}
        <group ref={sleepyEyes}>
          {[-1, 1].map((s) => (
            <mesh key={s} position={[0.1, 0.015, s * 0.04]} rotation={[0, Math.PI / 2, Math.PI]}>
              <torusGeometry args={[0.016, 0.004, 6, 12, Math.PI]} />
              <meshBasicMaterial color={palette.plum} />
            </mesh>
          ))}
        </group>
        <mesh position={[0.108, -0.012, 0]}>
          <sphereGeometry args={[0.012, 8, 8]} />
          <meshBasicMaterial color={palette.coral} />
        </mesh>
      </group>
      {/* front paws (stay put while the head turns) */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0.26, 0.02, 0.08 + s * 0.05]} scale={[1.4, 0.6, 1]}>
          <sphereGeometry args={[0.035, 10, 8]} />
          <Mat color={palette.cream} />
        </mesh>
      ))}
      {/* floating Zs */}
      {Array.from({ length: Z_COUNT }, (_, i) => (
        <group
          key={i}
          ref={(el) => {
            zs.current[i] = el;
          }}
        >
          <Billboard>
            <ZLetter material={zMaterials.current[i]} />
          </Billboard>
        </group>
      ))}
    </group>
  );
}
