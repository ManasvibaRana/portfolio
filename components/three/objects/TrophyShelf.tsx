import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/lib/palette";
import { Mat } from "../Mat";

const GOLD = { color: palette.gold, roughness: 0.35, metalness: 0.35 };

// Local origin = center of the floating plank, front facing +z (wall behind at z = -0.18).
export function TrophyShelf() {
  return (
    <group>
      <RoundedBox args={[1.3, 0.06, 0.36]} radius={0.02}>
        <Mat color={palette.wood} />
      </RoundedBox>
      {[-0.45, 0.45].map((x) => (
        <mesh key={x} position={[x, -0.1, -0.12]}>
          <boxGeometry args={[0.04, 0.16, 0.1]} />
          <Mat color={palette.woodDeep} />
        </mesh>
      ))}
      <CupTrophy position={[-0.35, 0.03, 0]} />
      <StarTrophy position={[0.15, 0.03, 0]} />
      <Medal position={[0.48, 0.03, -0.05]} />
    </group>
  );
}

function CupTrophy({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.17, 0.07, 0.17]} radius={0.015} position={[0, 0.035, 0]}>
        <Mat color={palette.lavenderDeep} />
      </RoundedBox>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.025, 0.035, 0.08, 12]} />
        <Mat {...GOLD} />
      </mesh>
      <mesh position={[0, 0.23, 0]}>
        <cylinderGeometry args={[0.1, 0.05, 0.17, 24]} />
        <Mat {...GOLD} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.1, 0.24, 0]} rotation={[0, 0, -side * (Math.PI / 2)]}>
          <torusGeometry args={[0.045, 0.012, 8, 16, Math.PI]} />
          <Mat {...GOLD} />
        </mesh>
      ))}
    </group>
  );
}

function StarTrophy({ position }: { position: [number, number, number] }) {
  const star = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? 0.11 : 0.05;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.035,
      bevelEnabled: true,
      bevelSize: 0.01,
      bevelThickness: 0.01,
      bevelSegments: 2,
    });
    geometry.center();
    return geometry;
  }, []);

  return (
    <group position={position}>
      <RoundedBox args={[0.15, 0.06, 0.12]} radius={0.015} position={[0, 0.03, 0]}>
        <Mat color={palette.mintDeep} />
      </RoundedBox>
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.12, 8]} />
        <Mat {...GOLD} />
      </mesh>
      <mesh geometry={star} position={[0, 0.28, 0]}>
        <Mat {...GOLD} />
      </mesh>
    </group>
  );
}

function Medal({ position }: { position: [number, number, number] }) {
  // Medal leaning against the wall on a ribbon.
  return (
    <group position={position} rotation={[-0.2, 0, 0]}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * 0.03, 0.2, -0.02]} rotation={[0, 0, side * 0.3]}>
          <boxGeometry args={[0.04, 0.18, 0.006]} />
          <Mat color={side < 0 ? palette.lavenderDeep : palette.pink} />
        </mesh>
      ))}
      <mesh position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.015, 24]} />
        <Mat {...GOLD} />
      </mesh>
    </group>
  );
}
