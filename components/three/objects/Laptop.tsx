import { RoundedBox } from "@react-three/drei";
import { palette } from "@/lib/palette";
import { Mat } from "../Mat";

// Local origin = laptop center on the desk surface. The keyboard faces -z
// (toward the character); the lid's back (with a sticker) faces the camera.
const CODE_LINES = [
  { x: -0.16, y: 0.36, w: 0.22, color: palette.lavender },
  { x: -0.1, y: 0.31, w: 0.3, color: palette.mint },
  { x: -0.06, y: 0.26, w: 0.34, color: palette.peach },
  { x: -0.12, y: 0.21, w: 0.26, color: palette.pink },
  { x: -0.04, y: 0.16, w: 0.4, color: palette.mint },
  { x: -0.14, y: 0.11, w: 0.22, color: palette.lavender },
];

export function Laptop() {
  return (
    <group>
      {/* base */}
      <RoundedBox args={[0.72, 0.035, 0.48]} radius={0.012} position={[0, 0.0175, 0]}>
        <Mat color={palette.lavender} />
      </RoundedBox>
      {/* keyboard + trackpad */}
      <mesh position={[0, 0.036, 0.04]} rotation={[-Math.PI / 2, 0, 0]} userData={{ noShadow: true }}>
        <planeGeometry args={[0.62, 0.22]} />
        <Mat color={palette.lavenderDeep} />
      </mesh>
      <mesh position={[0, 0.036, -0.16]} rotation={[-Math.PI / 2, 0, 0]} userData={{ noShadow: true }}>
        <planeGeometry args={[0.2, 0.1]} />
        <Mat color="#d9cbf5" />
      </mesh>
      {/* lid hinged at the far edge, tilted slightly back */}
      <group position={[0, 0.035, 0.235]} rotation={[0.22, 0, 0]}>
        <RoundedBox args={[0.72, 0.48, 0.025]} radius={0.012} position={[0, 0.24, 0]}>
          <Mat color={palette.lavender} />
        </RoundedBox>
        {/* screen (faces the character) */}
        <mesh position={[0, 0.24, -0.0135]} rotation={[0, Math.PI, 0]} userData={{ noShadow: true }}>
          <planeGeometry args={[0.66, 0.42]} />
          <meshStandardMaterial color="#2c2342" emissive="#2c2342" emissiveIntensity={0.6} />
        </mesh>
        {CODE_LINES.map((line, i) => (
          <mesh key={i} position={[-line.x, line.y, -0.015]} rotation={[0, Math.PI, 0]} userData={{ noShadow: true }}>
            <planeGeometry args={[line.w, 0.018]} />
            <meshBasicMaterial color={line.color} />
          </mesh>
        ))}
        {/* sticker on the back of the lid */}
        <mesh position={[0, 0.25, 0.0135]} userData={{ noShadow: true }}>
          <circleGeometry args={[0.075, 32]} />
          <Mat color={palette.pink} />
        </mesh>
        <mesh position={[0, 0.25, 0.014]} userData={{ noShadow: true }}>
          <circleGeometry args={[0.035, 24]} />
          <Mat color={palette.butter} />
        </mesh>
        <mesh position={[0.16, 0.12, 0.0135]} rotation={[0, 0, 0.3]} userData={{ noShadow: true }}>
          <planeGeometry args={[0.1, 0.06]} />
          <Mat color={palette.mint} />
        </mesh>
      </group>
    </group>
  );
}
