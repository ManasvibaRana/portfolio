import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { fx, studio } from "@/lib/store";
import { localHour, sampleDaylight } from "@/lib/timeOfDay";

const BG_DAY = new THREE.Color("#f9e7ef");
const BG_NIGHT = new THREE.Color("#211a35");
const SKY_DAY = new THREE.Color("#fff1e0");
const SKY_NIGHT = new THREE.Color("#8a86c9");
const GROUND_DAY = new THREE.Color("#d9c6ef");
const GROUND_NIGHT = new THREE.Color("#3a2f5c");
const SUN_DAY = new THREE.Color("#ffc890");
const SUN_NIGHT = new THREE.Color("#9fa8ff");

const lerp = THREE.MathUtils.lerp;
const skyNow = new THREE.Color();
const sunNow = new THREE.Color();

/** Golden-hour key light + soft fill, eased into a cozy night setup. */
export function Lights({ shadows }: { shadows: boolean }) {
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const fairyA = useRef<THREE.PointLight>(null);
  const fairyB = useRef<THREE.PointLight>(null);

  useFrame((state, dt) => {
    const target = studio.getState().night ? 1 : 0;
    fx.night = THREE.MathUtils.damp(fx.night, target, 2.5, dt);
    const n = fx.night;
    fx.music = THREE.MathUtils.damp(fx.music, studio.getState().music ? 1 : 0, 3, dt);

    state.scene.environmentIntensity = lerp(0.55, 0.12, n);
    if (hemi.current) {
      hemi.current.intensity = lerp(1.05, 0.4, n);
      hemi.current.color.lerpColors(SKY_DAY, SKY_NIGHT, n);
      hemi.current.groundColor.lerpColors(GROUND_DAY, GROUND_NIGHT, n);
    }
    if (sun.current) {
      // daylight tint follows the visitor's local time (cool morning, golden evening)
      sampleDaylight(localHour(), skyNow, sunNow);
      sun.current.intensity = lerp(1.9, 0.25, n);
      sun.current.color.lerpColors(sunNow, SUN_NIGHT, n);
    }
    if (ambient.current) ambient.current.intensity = lerp(0.15, 0.1, n);
    if (fairyA.current) fairyA.current.intensity = n * 0.9;
    if (fairyB.current) fairyB.current.intensity = n * 0.9;

    const bg = state.scene.background;
    if (bg instanceof THREE.Color) bg.lerpColors(BG_DAY, BG_NIGHT, n);
  });

  return (
    <>
      <color attach="background" args={[BG_DAY.getHex()]} />
      {/* Soft studio reflections from procedural light panels (no HDR download). Rendered once. */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#ffe2c4" position={[6, 6, 6]} scale={[8, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={1.2} color="#e3d6fb" position={[-6, 4, 2]} scale={[6, 6, 1]} target={[0, 0, 0]} />
        <Lightformer form="rect" intensity={0.8} color="#d8f3e6" position={[0, 8, -4]} scale={[8, 3, 1]} target={[0, 0, 0]} />
        <Lightformer form="circle" intensity={1} color="#ffffff" position={[0, 10, 0]} scale={6} rotation-x={Math.PI / 2} />
      </Environment>
      <hemisphereLight ref={hemi} args={[SKY_DAY, GROUND_DAY, 1.05]} />
      <ambientLight ref={ambient} intensity={0.15} />
      <directionalLight
        ref={sun}
        position={[6, 9, 6]}
        intensity={1.9}
        color={SUN_DAY}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-7}
        shadow-camera-right={7}
        shadow-camera-top={7}
        shadow-camera-bottom={-7}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      {/* fairy-light glow, only visible at night */}
      <pointLight ref={fairyA} position={[-1.2, 3.0, -3.0]} color="#ffc2d6" intensity={0} distance={5} decay={2} />
      <pointLight ref={fairyB} position={[-3.0, 3.0, 0.8]} color="#ffd9b0" intensity={0} distance={5} decay={2} />
    </>
  );
}
