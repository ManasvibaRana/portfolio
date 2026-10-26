import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/lib/palette";
import { studio } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Procedural chibi stand-in until public/models/character.glb exists.
// Local origin = floor under the chair, facing +z (toward the desk & camera).

const HOODIE = palette.lavender;
const SKIRT = palette.peach;
const EYES = "#2d1b3a";

const SHOULDER_X = 0.2;
const SHOULDER_Y = 0.97;
const ARM_LEN = 0.49;
// Typing pose: arms reach forward and slightly up to the keyboard.
const TYPE_PITCH = -0.2;
const TYPE_YAW = 0.17;
// Wave pose for the arm on the +x side (her left, closest to the camera).
const WAVE_PITCH = -1.3;
const WAVE_YAW = 0.6;
const WAVE_SECONDS = 2.8;

const HEAD_PIVOT_Y = 1.06;
const HEAD_CENTER = 0.32;
const HEAD_R = 0.36;

export default function ChibiPlaceholder() {
  const reduced = useReducedMotion();
  const head = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Mesh>(null);
  const armLeft = useRef<THREE.Group>(null); // +x, waves
  const armRight = useRef<THREE.Group>(null); // -x
  const start = useRef<number | null>(null);
  const waveWeight = useRef(reduced ? 0 : 1);
  const blink = useRef({ next: 2.5, until: 0 });
  const look = useRef(0);
  const lastWaveRequest = useRef(studio.getState().waveRequest);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const { active, booted, waveRequest } = studio.getState();
    // The wave starts once the boot screen is gone, and again whenever she's clicked.
    if (start.current === null && booted) start.current = t;
    if (waveRequest !== lastWaveRequest.current) {
      lastWaveRequest.current = waveRequest;
      if (booted) start.current = t;
    }
    const elapsed = start.current === null ? 0 : t - start.current;
    const motion = reduced ? 0 : 1;
    const paused = active !== null;

    const waving = !reduced && elapsed < WAVE_SECONDS;
    waveWeight.current = THREE.MathUtils.damp(waveWeight.current, waving ? 1 : 0, 5, dt);
    const w = waveWeight.current;
    const typing = motion * (paused ? 0 : 1) * (1 - w);

    // Alternating finger taps lift each hand a little.
    const tap = (phase: number) => typing * Math.max(0, Math.sin(t * 16 + phase)) * 0.07;

    if (armRight.current) {
      armRight.current.rotation.set(TYPE_PITCH - tap(0), TYPE_YAW, 0, "YXZ");
    }
    if (armLeft.current) {
      const pitch = THREE.MathUtils.lerp(TYPE_PITCH - tap(Math.PI), WAVE_PITCH, w);
      const yaw = THREE.MathUtils.lerp(-TYPE_YAW, WAVE_YAW + 0.35 * Math.sin(t * 11), w);
      armLeft.current.rotation.set(pitch, yaw, 0, "YXZ");
    }

    if (head.current) {
      head.current.rotation.x = (0.08 + Math.sin(t * 1.6) * 0.035 * motion) * (1 - w);
      // Turn toward the camera while waving or while a panel is open.
      look.current = THREE.MathUtils.damp(look.current, paused ? 1 : 0, 4, dt);
      head.current.rotation.y = Math.max(w, look.current) * 0.25;
      head.current.rotation.z = -w * 0.12 + Math.sin(t * 0.9) * 0.02 * motion;
    }
    if (torso.current) {
      torso.current.scale.y = 1 + Math.sin(t * 2) * 0.012 * motion;
    }
    if (mouth.current) {
      mouth.current.scale.setScalar(1 + w * 0.45);
    }

    // Blink every few seconds (kept even with reduced motion — it's tiny).
    const b = blink.current;
    if (t > b.next) {
      b.until = t + 0.13;
      b.next = t + 2.5 + Math.random() * 3;
    }
    if (eyes.current) eyes.current.scale.y = t < b.until ? 0.1 : 1;
  });

  return (
    <group>
      {/* legs */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.1, 0, 0]}>
          <mesh position={[0, 0.66, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.075, 0.28, 4, 10]} />
            <meshStandardMaterial color={palette.skin} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.38, 0.36]}>
            <capsuleGeometry args={[0.065, 0.36, 4, 10]} />
            <meshStandardMaterial color={palette.white} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.05, 0.4]} scale={[1, 0.7, 1.4]}>
            <sphereGeometry args={[0.075, 14, 10]} />
            <meshStandardMaterial color={palette.lavenderDeep} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* skirt + torso */}
      <mesh position={[0, 0.68, 0.02]}>
        <cylinderGeometry args={[0.22, 0.3, 0.16, 24]} />
        <meshStandardMaterial color={SKIRT} roughness={0.85} />
      </mesh>
      <group ref={torso} position={[0, 0.66, 0]}>
        <mesh position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.17, 0.22, 0.38, 24]} />
          <meshStandardMaterial color={HOODIE} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.37, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.04, 10, 24]} />
          <meshStandardMaterial color={palette.cream} roughness={0.9} />
        </mesh>
        {/* hoodie strings */}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.05, 0.27, 0.17]}>
            <capsuleGeometry args={[0.008, 0.1, 2, 6]} />
            <meshStandardMaterial color={palette.cream} />
          </mesh>
        ))}
      </group>

      {/* arms */}
      {[1, -1].map((s) => (
        <group key={s} ref={s > 0 ? armLeft : armRight} position={[s * SHOULDER_X, SHOULDER_Y, 0]}>
          <mesh>
            <sphereGeometry args={[0.08, 14, 10]} />
            <meshStandardMaterial color={HOODIE} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, (ARM_LEN - 0.04) / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.062, ARM_LEN - 0.16, 4, 10]} />
            <meshStandardMaterial color={HOODIE} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, ARM_LEN]}>
            <sphereGeometry args={[0.065, 14, 10]} />
            <meshStandardMaterial color={palette.skin} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* neck + head */}
      <mesh position={[0, HEAD_PIVOT_Y, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.08, 12]} />
        <meshStandardMaterial color={palette.skin} roughness={0.8} />
      </mesh>
      <group ref={head} position={[0, HEAD_PIVOT_Y, 0]}>
        <group position={[0, HEAD_CENTER, 0]}>
          <mesh>
            <sphereGeometry args={[HEAD_R, 32, 24]} />
            <meshStandardMaterial color={palette.skin} roughness={0.75} />
          </mesh>

          {/* eyes */}
          <group ref={eyes} position={[0, -0.02, 0]}>
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.13, 0, 0.32]}>
                <mesh scale={[1, 1.3, 0.5]}>
                  <sphereGeometry args={[0.058, 16, 12]} />
                  <meshStandardMaterial color={EYES} roughness={0.3} />
                </mesh>
                <mesh position={[0.02, 0.035, 0.03]}>
                  <sphereGeometry args={[0.018, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" />
                </mesh>
              </group>
            ))}
          </group>

          {/* blush */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.21, -0.11, 0.27]} rotation={[0, s * 0.65, 0]} scale={[1, 0.55, 0.3]}>
              <sphereGeometry args={[0.05, 12, 8]} />
              <meshStandardMaterial color={palette.pink} transparent opacity={0.75} />
            </mesh>
          ))}

          {/* smile */}
          <mesh ref={mouth} position={[0, -0.13, 0.335]} rotation={[0, 0, Math.PI]}>
            <torusGeometry args={[0.035, 0.01, 8, 16, Math.PI]} />
            <meshStandardMaterial color={palette.plum} />
          </mesh>

          {/* hair */}
          <mesh position={[0, 0.01, -0.005]}>
            <sphereGeometry args={[0.385, 32, 16, 0, Math.PI * 2, 0, 1.15]} />
            <meshStandardMaterial color={palette.hair} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, -0.01]}>
            <sphereGeometry args={[0.39, 32, 20, Math.PI / 2 + 0.75, Math.PI * 2 - 1.5, 0, 2.35]} />
            <meshStandardMaterial color={palette.hair} roughness={0.7} side={THREE.DoubleSide} />
          </mesh>
          {[
            [-0.13, 0.17, 0.3],
            [0, 0.2, 0.31],
            [0.13, 0.17, 0.3],
          ].map(([x, y, z], i) => (
            <mesh key={i} position={[x, y, z]} scale={[1.1, 0.6, 0.5]}>
              <sphereGeometry args={[0.11, 16, 10]} />
              <meshStandardMaterial color={palette.hair} roughness={0.7} />
            </mesh>
          ))}
          {[-1, 1].map((s) => (
            <group key={s}>
              {/* side locks */}
              <mesh position={[s * 0.31, -0.12, 0.08]}>
                <capsuleGeometry args={[0.06, 0.25, 4, 10]} />
                <meshStandardMaterial color={palette.hair} roughness={0.7} />
              </mesh>
              {/* buns + hair ties */}
              <mesh position={[s * 0.25, 0.27, -0.06]}>
                <sphereGeometry args={[0.13, 20, 14]} />
                <meshStandardMaterial color={palette.hair} roughness={0.7} />
              </mesh>
              <mesh position={[s * 0.2, 0.2, -0.03]}>
                <sphereGeometry args={[0.04, 10, 8]} />
                <meshStandardMaterial color={palette.mintDeep} roughness={0.5} />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </group>
  );
}
