import { createContext, useContext, useRef } from "react";
import { useFrame, type ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import type { ObjectId } from "@/data/sceneObjects";
import { studio } from "@/lib/store";

/** Set by <Interactive> so materials inside know which object they belong to. */
export const InteractiveContext = createContext<ObjectId | null>(null);

const GLOW = new THREE.Color("#fff1d6");
const GLOW_INTENSITY = 0.3;

type MatProps = Omit<ThreeElements["meshStandardMaterial"], "ref"> & { color: string };

/**
 * Soft matte pastel material. Inside an <Interactive>, it gently glows while
 * that object is hovered (unless an explicit `emissive` is passed).
 */
export function Mat({ color, ...props }: MatProps) {
  const id = useContext(InteractiveContext);
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  const glows = id !== null && props.emissive === undefined;

  useFrame((_, dt) => {
    if (!glows || !ref.current) return;
    const target = studio.getState().hovered === id ? GLOW_INTENSITY : 0;
    ref.current.emissiveIntensity = THREE.MathUtils.damp(ref.current.emissiveIntensity, target, 12, dt);
  });

  return (
    <meshStandardMaterial
      ref={ref}
      color={color}
      roughness={0.8}
      metalness={0}
      {...(glows ? { emissive: GLOW, emissiveIntensity: 0 } : null)}
      {...props}
    />
  );
}
