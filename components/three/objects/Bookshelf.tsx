import { RoundedBox } from "@react-three/drei";
import { palette } from "@/lib/palette";
import { skills } from "@/data/skills";
import { Mat } from "../Mat";

// Local origin = floor center of the shelf, front facing +z.
// Shelf levels (top surface of each plank).
const LEVELS = [0.1, 0.775, 1.475];
const HEIGHTS = [0.5, 0.44, 0.54, 0.47, 0.52, 0.45, 0.5];
const WIDTHS = [0.12, 0.1, 0.13, 0.11, 0.12, 0.13, 0.11];

/** One book per skill category: first four on the top shelf, the rest in the middle. */
function skillBooks() {
  const rows: Array<{ x: number; y: number; w: number; h: number; color: string; id: string }> = [];
  let cursor = [-0.62, -0.62];
  skills.forEach((category, i) => {
    const row = i < 4 ? 0 : 1;
    const w = WIDTHS[i % WIDTHS.length];
    const h = HEIGHTS[i % HEIGHTS.length];
    rows.push({ x: cursor[row] + w / 2, y: LEVELS[row === 0 ? 2 : 1] + h / 2, w, h, color: category.color, id: category.id });
    cursor = row === 0 ? [cursor[0] + w + 0.015, cursor[1]] : [cursor[0], cursor[1] + w + 0.015];
  });
  return rows;
}

const BOOKS = skillBooks();

export function Bookshelf() {
  return (
    <group>
      {/* frame */}
      {[-0.72, 0.72].map((x) => (
        <RoundedBox key={x} args={[0.06, 2.2, 0.5]} radius={0.02} position={[x, 1.1, 0]}>
          <Mat color={palette.mint} />
        </RoundedBox>
      ))}
      <RoundedBox args={[1.5, 0.06, 0.5]} radius={0.02} position={[0, 2.17, 0]}>
        <Mat color={palette.mint} />
      </RoundedBox>
      <RoundedBox args={[1.5, 0.1, 0.5]} radius={0.02} position={[0, 0.05, 0]}>
        <Mat color={palette.mintDeep} />
      </RoundedBox>
      {[0.75, 1.45].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.42, 0.05, 0.48]} />
          <Mat color={palette.mint} />
        </mesh>
      ))}
      <mesh position={[0, 1.1, -0.235]}>
        <boxGeometry args={[1.42, 2.1, 0.03]} />
        <Mat color={palette.cream} />
      </mesh>

      {/* skill category books (spines face out) */}
      {BOOKS.map((book) => (
        <group key={book.id} position={[book.x, book.y, 0.02]}>
          <RoundedBox args={[book.w, book.h, 0.36]} radius={0.012}>
            <Mat color={book.color} />
          </RoundedBox>
          <mesh position={[0, book.h * 0.22, 0.181]}>
            <planeGeometry args={[book.w * 0.7, 0.03]} />
            <Mat color={palette.cream} />
          </mesh>
          <mesh position={[0, -book.h * 0.28, 0.181]}>
            <planeGeometry args={[book.w * 0.7, 0.015]} />
            <Mat color={palette.cream} />
          </mesh>
        </group>
      ))}

      {/* top shelf: leaning book + tiny plant */}
      <group position={[0.38, LEVELS[2], 0.02]} rotation={[0, 0, -0.32]}>
        <RoundedBox args={[0.1, 0.42, 0.32]} radius={0.012} position={[0.05, 0.21, 0]}>
          <Mat color={palette.butter} />
        </RoundedBox>
      </group>
      <group position={[0.58, LEVELS[2], 0]}>
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.07, 0.055, 0.14, 16]} />
          <Mat color={palette.peach} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <icosahedronGeometry args={[0.1, 0]} />
          <Mat color={palette.mintDeep} flatShading />
        </mesh>
      </group>

      {/* middle shelf: little globe */}
      <group position={[0.42, LEVELS[1], 0]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.04, 16]} />
          <Mat color={palette.lavenderDeep} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <sphereGeometry args={[0.15, 20, 14]} />
          <Mat color={palette.sky} />
        </mesh>
      </group>

      {/* bottom shelf: basket + stacked books */}
      <RoundedBox args={[0.6, 0.42, 0.4]} radius={0.05} position={[-0.32, LEVELS[0] + 0.21, 0]}>
        <Mat color={palette.peach} />
      </RoundedBox>
      {[palette.lavender, palette.pink, palette.mintDeep].map((color, i) => (
        <RoundedBox
          key={color}
          args={[0.42, 0.07, 0.3]}
          radius={0.012}
          position={[0.34, LEVELS[0] + 0.035 + i * 0.072, 0]}
          rotation={[0, (i - 1) * 0.12, 0]}
        >
          <Mat color={color} />
        </RoundedBox>
      ))}

      {/* top: plant on the shelf roof */}
      <group position={[-0.45, 2.2, 0]}>
        <mesh position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.09, 0.07, 0.16, 16]} />
          <Mat color={palette.lavender} />
        </mesh>
        {[
          [0, 0.25, 0, 0.11],
          [0.08, 0.2, 0.04, 0.08],
          [-0.07, 0.21, -0.03, 0.08],
        ].map(([x, y, z, r], i) => (
          <mesh key={i} position={[x, y, z]}>
            <icosahedronGeometry args={[r, 0]} />
            <Mat color={palette.mint} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  );
}
