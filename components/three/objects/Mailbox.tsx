import { RoundedBox } from "@react-three/drei";
import { palette } from "@/lib/palette";
import { Mat } from "../Mat";

// Local origin = mailbox center on the desk surface, slot facing +z.
export function Mailbox() {
  return (
    <group>
      <RoundedBox args={[0.26, 0.26, 0.36]} radius={0.1} smoothness={6} position={[0, 0.13, 0]}>
        <Mat color={palette.pink} />
      </RoundedBox>
      {/* slot */}
      <mesh position={[0, 0.17, 0.181]}>
        <planeGeometry args={[0.14, 0.022]} />
        <Mat color={palette.plum} />
      </mesh>
      {/* letter poking out of the slot */}
      <group position={[0, 0.2, 0.19]} rotation={[-0.35, 0, 0.05]}>
        <mesh position={[0, 0.03, 0]}>
          <boxGeometry args={[0.15, 0.09, 0.006]} />
          <Mat color={palette.cream} />
        </mesh>
        <mesh position={[0, 0.03, 0.004]}>
          <circleGeometry args={[0.018, 16]} />
          <Mat color={palette.coral} />
        </mesh>
      </group>
      {/* flag */}
      <mesh position={[0.138, 0.2, -0.05]}>
        <boxGeometry args={[0.014, 0.2, 0.014]} />
        <Mat color={palette.white} />
      </mesh>
      <mesh position={[0.138, 0.27, -0.0]}>
        <boxGeometry args={[0.012, 0.07, 0.1]} />
        <Mat color={palette.coral} />
      </mesh>
      {/* envelope lying on the desk */}
      <group position={[-0.24, 0.004, 0.12]} rotation={[0, 0.35, 0]}>
        <mesh>
          <boxGeometry args={[0.22, 0.006, 0.14]} />
          <Mat color={palette.cream} />
        </mesh>
        <mesh position={[0, 0.0035, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.02, 16]} />
          <Mat color={palette.coral} />
        </mesh>
      </group>
    </group>
  );
}
