import { RoundedBox } from "@react-three/drei";
import { palette } from "@/lib/palette";
import { Mat } from "../Mat";

// Local origin = center of the board on the wall surface, facing +z.
export function Whiteboard() {
  return (
    <group>
      <RoundedBox args={[1.9, 1.2, 0.06]} radius={0.025} position={[0, 0, 0.03]}>
        <Mat color="#ece6f6" />
      </RoundedBox>
      <mesh position={[0, 0, 0.062]}>
        <planeGeometry args={[1.76, 1.06]} />
        <Mat color="#ffffff" roughness={0.4} />
      </mesh>

      {/* doodled "role card": a title, a badge and a few task lines */}
      <mesh position={[0, 0.36, 0.064]}>
        <planeGeometry args={[0.6, 0.035]} />
        <Mat color={palette.plum} />
      </mesh>
      <mesh position={[-0.42, 0.12, 0.066]}>
        <circleGeometry args={[0.07, 24]} />
        <Mat color={palette.mintDeep} />
      </mesh>
      <mesh position={[-0.05, 0.15, 0.064]}>
        <planeGeometry args={[0.5, 0.03]} />
        <Mat color={palette.plumSoft} />
      </mesh>
      <mesh position={[-0.12, 0.08, 0.064]}>
        <planeGeometry args={[0.36, 0.02]} />
        <Mat color="#b9abc8" />
      </mesh>
      {[-0.08, -0.17, -0.26].map((y, i) => (
        <group key={y} position={[0, y, 0.066]}>
          <mesh position={[-0.42, 0, 0]}>
            <circleGeometry args={[0.022, 16]} />
            <Mat color={[palette.peachDeep, palette.lavenderDeep, palette.mintDeep][i]} />
          </mesh>
          <mesh position={[-0.08 + i * 0.03, 0, 0]}>
            <planeGeometry args={[0.6 - i * 0.08, 0.018]} />
            <Mat color="#b9abc8" />
          </mesh>
        </group>
      ))}

      {/* sticky notes */}
      <mesh position={[-0.7, 0.34, 0.068]} rotation={[0, 0, -0.08]}>
        <planeGeometry args={[0.2, 0.2]} />
        <Mat color={palette.peach} />
      </mesh>
      <mesh position={[0.7, 0.32, 0.068]} rotation={[0, 0, 0.1]}>
        <planeGeometry args={[0.2, 0.2]} />
        <Mat color={palette.mint} />
      </mesh>

      {/* marker tray */}
      <RoundedBox args={[1.3, 0.04, 0.1]} radius={0.015} position={[0, -0.63, 0.08]}>
        <Mat color="#ece6f6" />
      </RoundedBox>
      {[palette.coral, palette.mintDeep, palette.lavenderDeep].map((color, i) => (
        <mesh key={color} position={[-0.3 + i * 0.22, -0.595, 0.09]} rotation={[0, 0, Math.PI / 2]}>
          <capsuleGeometry args={[0.014, 0.12, 4, 8]} />
          <Mat color={color} />
        </mesh>
      ))}
    </group>
  );
}
