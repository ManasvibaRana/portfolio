import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { now } from "@/data/now";
import { sfx } from "@/lib/lofi";
import { palette } from "@/lib/palette";
import { fx, studio } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { clickable } from "./clickable";
import { Mat } from "./Mat";

// Desk top surface sits at y = 1.0, spanning x [-0.8, 1.5] and z [-2.15, -1.15].
export const DESK_TOP = 1.0;

export function Desk() {
  return (
    <group>
      <RoundedBox args={[2.3, 0.1, 1.0]} radius={0.04} position={[0.35, DESK_TOP - 0.05, -1.65]}>
        <Mat color={palette.wood} />
      </RoundedBox>
      {/* drawer unit (left) */}
      <RoundedBox args={[0.42, 0.86, 0.9]} radius={0.04} position={[-0.52, 0.47, -1.65]}>
        <Mat color={palette.mint} />
      </RoundedBox>
      {[0.68, 0.32].map((y) => (
        <group key={y}>
          <RoundedBox args={[0.02, 0.3, 0.78]} radius={0.008} position={[-0.3, y, -1.65]}>
            <Mat color={palette.mintDeep} />
          </RoundedBox>
          <mesh position={[-0.29, y, -1.65]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 12]} />
            <Mat color={palette.cream} />
          </mesh>
        </group>
      ))}
      {/* legs (right) */}
      {[-2.07, -1.23].map((z) => (
        <mesh key={z} position={[1.42, 0.45, z]}>
          <cylinderGeometry args={[0.045, 0.04, 0.9, 12]} />
          <Mat color={palette.woodDeep} />
        </mesh>
      ))}

      <Chair />
      <DeskLamp position={[-0.5, DESK_TOP, -1.98]} />
      <Mug position={[1.02, DESK_TOP, -1.98]} />
      <PenCup position={[-0.15, DESK_TOP, -1.35]} />
      {/* sticky notes */}
      <NowNote position={[0.95, DESK_TOP, -1.32]} />
      <mesh position={[0.78, DESK_TOP + 0.004, -1.36]} rotation={[-Math.PI / 2, 0, -0.15]} userData={{ noShadow: true }}>
        <planeGeometry args={[0.13, 0.13]} />
        <Mat color={palette.mint} />
      </mesh>
    </group>
  );
}

function Chair() {
  return (
    <group position={[0.35, 0, -2.47]}>
      <RoundedBox args={[0.62, 0.1, 0.56]} radius={0.045} position={[0, 0.55, 0]}>
        <Mat color={palette.pink} />
      </RoundedBox>
      <RoundedBox args={[0.6, 0.62, 0.09]} radius={0.04} position={[0, 0.95, -0.3]}>
        <Mat color={palette.pink} />
      </RoundedBox>
      <mesh position={[0, 0.27, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.45, 12]} />
        <Mat color={palette.white} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.28, 0.3, 0.05, 24]} />
        <Mat color={palette.white} />
      </mesh>
    </group>
  );
}

/** "Currently exploring" sticky note: click it to read it. */
function NowNote({ position }: { position: [number, number, number] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => setOpen(false), 4000);
    return () => window.clearTimeout(t);
  }, [open]);

  return (
    <group position={position} {...clickable(() => setOpen(true))}>
      <mesh position={[0, 0.003, 0]} rotation={[-Math.PI / 2, 0, 0.25]} userData={{ noShadow: true }}>
        <planeGeometry args={[0.16, 0.16]} />
        <Mat color={palette.butter} />
      </mesh>
      {/* scribbles */}
      {[0.03, 0, -0.03].map((z, i) => (
        <mesh key={z} position={[0.005 * i, 0.004, z]} rotation={[-Math.PI / 2, 0, 0.25]} userData={{ noShadow: true }}>
          <planeGeometry args={[0.1 - i * 0.02, 0.008]} />
          <meshBasicMaterial color={palette.plumSoft} />
        </mesh>
      ))}
      {open && (
        <Html position={[0, 0.32, 0]} center zIndexRange={[35, 0]} style={{ pointerEvents: "none" }}>
          <div className="now-note">
            <span className="now-note-label">Currently exploring</span>
            {now.exploring}
          </div>
        </Html>
      )}
    </group>
  );
}

function DeskLamp({ position }: { position: [number, number, number] }) {
  const bulb = useRef<THREE.MeshStandardMaterial>(null);
  const light = useRef<THREE.PointLight>(null);

  // On at night by default; click to switch it yourself.
  useFrame((_, dt) => {
    fx.lamp = THREE.MathUtils.damp(fx.lamp, studio.getState().lampOn ? 1 : 0, 8, dt);
    if (bulb.current) bulb.current.emissiveIntensity = 0.1 + fx.lamp * 2.5;
    if (light.current) light.current.intensity = fx.lamp * 1.4;
  });

  const toggle = () => {
    void sfx("click");
    studio.setState({ lampOn: !studio.getState().lampOn });
  };

  return (
    <group position={position} {...clickable(toggle)}>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.1, 0.11, 0.04, 24]} />
        <Mat color={palette.cream} />
      </mesh>
      <mesh position={[0, 0.24, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 0.44, 8]} />
        <Mat color={palette.cream} />
      </mesh>
      <group position={[0, 0.46, 0]} rotation={[0.25, 0, 0.55]}>
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.05, 0.12, 0.14, 24, 1, true]} />
          <Mat color={palette.peach} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.07, 0]} userData={{ noShadow: true }}>
          <sphereGeometry args={[0.04, 16, 12]} />
          <meshStandardMaterial ref={bulb} color="#fff3d1" emissive="#ffd58f" emissiveIntensity={0.1} />
        </mesh>
        <pointLight ref={light} position={[0, -0.12, 0]} color="#ffcf8a" intensity={0} distance={3.5} decay={2} />
      </group>
    </group>
  );
}

function Mug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.075, 0]}>
        <cylinderGeometry args={[0.065, 0.06, 0.15, 20]} />
        <Mat color={palette.lavender} />
      </mesh>
      <mesh position={[0, 0.148, 0]} userData={{ noShadow: true }}>
        <cylinderGeometry args={[0.055, 0.055, 0.005, 20]} />
        <Mat color="#a0705a" />
      </mesh>
      <mesh position={[0.075, 0.08, 0]}>
        <torusGeometry args={[0.035, 0.012, 8, 16]} />
        <Mat color={palette.lavender} />
      </mesh>
      <Steam />
    </group>
  );
}

const PUFFS = 6;

/** Soft puffs of steam rising from the coffee. */
function Steam() {
  const reduced = useReducedMotion();
  const puffs = useRef<Array<THREE.Mesh | null>>([]);

  useFrame(({ clock }) => {
    if (reduced) return;
    const t = clock.elapsedTime;
    puffs.current.forEach((puff, i) => {
      if (!puff) return;
      const p = (t * 0.22 + i / PUFFS) % 1;
      puff.position.set(Math.sin(p * 5 + i * 2) * 0.035, 0.16 + p * 0.36, Math.cos(p * 4 + i) * 0.02);
      // wisps stretch tall and widen as they rise, then fade out
      const s = 0.5 + p * 1.8;
      puff.scale.set(s, s * 1.6, s);
      (puff.material as THREE.MeshBasicMaterial).opacity = Math.sin(p * Math.PI) * 0.16;
    });
  });

  if (reduced) return null;
  return (
    <>
      {Array.from({ length: PUFFS }, (_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            puffs.current[i] = el;
          }}
          userData={{ noShadow: true }}
          raycast={() => null}
        >
          <sphereGeometry args={[0.025, 10, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

function PenCup({ position }: { position: [number, number, number] }) {
  const pens = [
    { x: -0.015, z: 0.01, tilt: 0.12, color: palette.coral },
    { x: 0.02, z: -0.01, tilt: -0.1, color: palette.mintDeep },
    { x: 0, z: 0.02, tilt: 0.02, color: palette.lavenderDeep },
  ];
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} />
        <Mat color={palette.peach} />
      </mesh>
      {pens.map((p, i) => (
        <mesh key={i} position={[p.x, 0.15, p.z]} rotation={[0, 0, p.tilt]}>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 6]} />
          <Mat color={p.color} />
        </mesh>
      ))}
    </group>
  );
}
