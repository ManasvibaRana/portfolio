import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/lib/palette";
import { fx } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Mat } from "../Mat";

const RING_COUNT = 3;

/** Little smart-speaker lamp that emits sound-wave rings (a nod to voice-AI). */
export function SpeakerLamp() {
  const reduced = useReducedMotion();
  const rings = useRef<Array<THREE.Mesh | null>>([]);
  const glow = useRef<THREE.MeshStandardMaterial>(null);

  const phase = useRef(0);

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    // rings pulse faster and wider while the lo-fi music plays
    phase.current += dt * (0.45 + fx.music * 0.75);
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const progress = reduced ? 0.35 + i * 0.2 : (phase.current + i / RING_COUNT) % 1;
      ring.scale.setScalar(0.17 + progress * (0.42 + fx.music * 0.2));
      (ring.material as THREE.MeshBasicMaterial).opacity = reduced ? 0.18 : (1 - progress) * (0.55 + fx.music * 0.2);
    });
    if (glow.current) {
      const pulse = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(t * (3 + fx.music * 5));
      glow.current.emissiveIntensity = 0.6 + pulse * (0.8 + fx.music * 0.6) + fx.night * 0.8;
    }
  });

  return (
    <group>
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.12, 0.13, 0.16, 32]} />
        <Mat color={palette.lavender} roughness={1} />
      </mesh>
      {/* fabric bands */}
      {[0.04, 0.08, 0.12].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} userData={{ noShadow: true }}>
          <torusGeometry args={[0.126, 0.004, 6, 32]} />
          <Mat color={palette.lavenderDeep} />
        </mesh>
      ))}
      {/* light ring */}
      <mesh position={[0, 0.165, 0]} rotation={[Math.PI / 2, 0, 0]} userData={{ noShadow: true }}>
        <torusGeometry args={[0.112, 0.013, 10, 40]} />
        <meshStandardMaterial ref={glow} color={palette.mint} emissive={palette.mintDeep} emissiveIntensity={1} />
      </mesh>
      {/* frosted dome */}
      <mesh position={[0, 0.165, 0]}>
        <sphereGeometry args={[0.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Mat color={palette.cream} emissive={palette.peach} emissiveIntensity={0.25} />
      </mesh>
      {/* sound-wave rings */}
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            rings.current[i] = el;
          }}
          position={[0, 0.17, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          userData={{ noShadow: true }}
          raycast={() => null}
        >
          <ringGeometry args={[0.92, 1, 48]} />
          <meshBasicMaterial color={palette.mintDeep} transparent depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}
