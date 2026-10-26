import { useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { fx } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";

const COLORS = ["#ffc9a8", "#b8ead2", "#c9b6f0", "#ffb3c7", "#fff0a8"];
const SAMPLES = 90;
const BULB_EVERY = 5;

/** Points along a wire with `swags` drooping loops between `from` and `to`. */
function stringPoints(from: THREE.Vector3, to: THREE.Vector3, swags: number, sag: number) {
  return Array.from({ length: SAMPLES + 1 }, (_, i) => {
    const t = i / SAMPLES;
    const p = from.clone().lerp(to, t);
    p.y -= sag * Math.abs(Math.sin(Math.PI * swags * t));
    return p;
  });
}

/** Garland along the top of both walls; glows at night. */
export function FairyLights() {
  const reduced = useReducedMotion();

  const strings = useMemo(() => {
    const wires = [
      stringPoints(new THREE.Vector3(-3.4, 3.35, -3.44), new THREE.Vector3(3.4, 3.35, -3.44), 3, 0.25),
      stringPoints(new THREE.Vector3(-3.44, 3.35, -3.4), new THREE.Vector3(-3.44, 3.35, 3.4), 3, 0.25),
    ];
    return wires.map((points) => ({
      curve: new THREE.CatmullRomCurve3(points),
      bulbs: points.filter((_, i) => i % BULB_EVERY === 2).map((p) => p.clone().setY(p.y - 0.035)),
    }));
  }, []);

  const bulbGeometry = useMemo(() => new THREE.SphereGeometry(0.035, 10, 8), []);
  const materials = useMemo(
    () => COLORS.map((c) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.15, roughness: 0.4 })),
    [],
  );

  useEffect(
    () => () => {
      bulbGeometry.dispose();
      materials.forEach((m) => m.dispose());
    },
    [bulbGeometry, materials],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    materials.forEach((m, i) => {
      const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(t * 2.2 + i * 1.3);
      m.emissiveIntensity = 0.15 + fx.night * 2.2 * twinkle;
    });
  });

  return (
    <group>
      {strings.map(({ curve, bulbs }, si) => (
        <group key={si}>
          <mesh>
            <tubeGeometry args={[curve, 160, 0.006, 4, false]} />
            <meshStandardMaterial color="#7a6a80" />
          </mesh>
          {bulbs.map((p, i) => (
            <mesh key={i} position={p} geometry={bulbGeometry} material={materials[(i + si) % materials.length]} />
          ))}
        </group>
      ))}
    </group>
  );
}
