import { useLayoutEffect, useRef, type ReactNode } from "react";
import * as THREE from "three";

/**
 * Enables cast/receive shadows on every mesh below it, so individual objects
 * don't need the props. Meshes with `userData.noShadow` are skipped.
 */
export function Shadowed({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);

  useLayoutEffect(() => {
    ref.current?.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh || mesh.userData.noShadow) return;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    });
  });

  return <group ref={ref}>{children}</group>;
}
