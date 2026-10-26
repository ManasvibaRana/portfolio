import { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import Character from "@/components/Character";
import { site } from "@/data/site";
import { studio } from "@/lib/store";

const GREETINGS = [
  `Hi, I'm ${site.firstName}! Welcome to my studio.`,
  "Try clicking the laptop to see my projects!",
  "Psst... the cat loves a little attention.",
  "Want the quick version? Hit Recruiter mode.",
];

/** The character on her chair. Hover over her and she waves and says hi. */
export function CharacterSpot({ position }: { position: [number, number, number] }) {
  const [line, setLine] = useState<string | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!line) return;
    const t = window.setTimeout(() => setLine(null), 3200);
    return () => window.clearTimeout(t);
  }, [line]);

  const greet = () => {
    studio.setState({ waveRequest: studio.getState().waveRequest + 1 });
    setLine(GREETINGS[count % GREETINGS.length]);
    setCount((c) => c + 1);
  };

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        // one greeting per hover; wait for the bubble to close before the next
        if (!line) greet();
      }}
    >
      <Character />
      {line && (
        <Html position={[0, 2.15, 0]} center zIndexRange={[35, 0]} style={{ pointerEvents: "none" }}>
          <div key={count} className="speech-bubble">
            {line}
          </div>
        </Html>
      )}
    </group>
  );
}
