import type { ProjectArt as ArtKind } from "@/data/projects";

// Small hand-drawn previews for each project card (viewBox 320×180).
const PLUM = "#3d2350";
const SOFT = "#6b4f80";
const CREAM = "#fffaf3";

function Frame({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 180" className="block h-full w-full" aria-hidden focusable="false">
      <defs>
        <pattern id="art-dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill={PLUM} opacity="0.12" />
        </pattern>
      </defs>
      <rect width="320" height="180" fill={accent} />
      <rect width="320" height="180" fill="url(#art-dots)" />
      {children}
    </svg>
  );
}

function VisionLab({ accent }: { accent: string }) {
  return (
    <Frame accent={accent}>
      {/* camera viewport */}
      <rect x="24" y="22" width="176" height="136" rx="14" fill={CREAM} />
      <rect x="24" y="22" width="176" height="18" rx="9" fill={PLUM} opacity="0.9" />
      <circle cx="36" cy="31" r="3" fill="#ff8fa3" />
      <circle cx="46" cy="31" r="3" fill="#f2cf6b" />
      <circle cx="56" cy="31" r="3" fill="#86d3b0" />
      {/* person */}
      <circle cx="82" cy="78" r="13" fill="#f6a57f" />
      <rect x="64" y="94" width="36" height="46" rx="16" fill="#a58fe0" />
      <rect x="54" y="60" width="56" height="88" rx="4" fill="none" stroke="#86d3b0" strokeWidth="2.5" strokeDasharray="6 4" />
      <rect x="54" y="50" width="62" height="13" rx="3" fill="#86d3b0" />
      <text x="58" y="60" fontSize="9" fontFamily="monospace" fill={PLUM}>person 0.94</text>
      {/* cup */}
      <rect x="140" y="112" width="24" height="28" rx="5" fill="#ff8fa3" />
      <path d="M164 118a7 7 0 0 1 0 14" stroke="#ff8fa3" strokeWidth="4" fill="none" />
      <rect x="132" y="100" width="44" height="48" rx="4" fill="none" stroke="#f6a57f" strokeWidth="2.5" strokeDasharray="6 4" />
      <rect x="132" y="90" width="46" height="13" rx="3" fill="#f6a57f" />
      <text x="136" y="100" fontSize="9" fontFamily="monospace" fill={PLUM}>cup 0.88</text>
      {/* AI chat bubbles */}
      <rect x="214" y="40" width="88" height="34" rx="12" fill={CREAM} />
      <rect x="224" y="50" width="52" height="5" rx="2.5" fill={SOFT} opacity="0.5" />
      <rect x="224" y="60" width="36" height="5" rx="2.5" fill={SOFT} opacity="0.35" />
      <rect x="226" y="84" width="76" height="30" rx="12" fill={PLUM} />
      <circle cx="248" cy="99" r="3.5" fill={CREAM} />
      <circle cx="262" cy="99" r="3.5" fill={CREAM} opacity="0.7" />
      <circle cx="276" cy="99" r="3.5" fill={CREAM} opacity="0.45" />
      <path d="M262 124l5 10 10 5-10 5-5 10-5-10-10-5 10-5z" fill={CREAM} />
    </Frame>
  );
}

function Kanban({ accent }: { accent: string }) {
  const columns = [
    { x: 22, cards: [{ h: 26, c: "#c9b6f0" }, { h: 34, c: CREAM }, { h: 22, c: CREAM }] },
    { x: 120, cards: [{ h: 34, c: "#ffb3c7" }, { h: 26, c: CREAM }] },
    { x: 218, cards: [{ h: 26, c: "#86d3b0" }, { h: 26, c: "#86d3b0" }, { h: 34, c: CREAM }] },
  ];
  return (
    <Frame accent={accent}>
      {columns.map((col, i) => {
        let y = 50;
        return (
          <g key={col.x}>
            <rect x={col.x} y="20" width="80" height="146" rx="12" fill={CREAM} opacity="0.55" />
            <rect x={col.x + 10} y="30" width={[34, 44, 30][i]} height="7" rx="3.5" fill={PLUM} opacity="0.75" />
            {col.cards.map((card, j) => {
              const el = (
                <g key={j}>
                  <rect x={col.x + 8} y={y} width="64" height={card.h} rx="7" fill={card.c} stroke={PLUM} strokeOpacity="0.08" />
                  <rect x={col.x + 15} y={y + 8} width="34" height="4" rx="2" fill={PLUM} opacity="0.45" />
                  {card.h > 26 && <rect x={col.x + 15} y={y + 17} width="24" height="4" rx="2" fill={PLUM} opacity="0.25" />}
                </g>
              );
              y += card.h + 8;
              return el;
            })}
          </g>
        );
      })}
      <circle cx="286" cy="150" r="13" fill={PLUM} />
      <path d="m280 150 4.5 4.5 8-9" stroke={CREAM} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

function MoodWave({ accent }: { accent: string }) {
  const wave = "M20 120 C 50 80, 70 80, 95 105 S 140 140, 165 95 S 205 55, 230 85";
  return (
    <Frame accent={accent}>
      <rect x="14" y="20" width="230" height="140" rx="16" fill={CREAM} />
      <path d={`${wave} L 230 150 L 20 150 Z`} fill="#c9b6f0" opacity="0.45" />
      <path d={wave} stroke={PLUM} strokeWidth="3" fill="none" strokeLinecap="round" />
      {[
        [95, 105],
        [165, 95],
        [230, 85],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="5" fill="#f6a57f" stroke={CREAM} strokeWidth="2" />
      ))}
      <rect x="28" y="32" width="60" height="7" rx="3.5" fill={PLUM} opacity="0.7" />
      {/* habit grid */}
      {Array.from({ length: 15 }, (_, i) => (
        <rect
          key={i}
          x={258 + (i % 3) * 16}
          y={28 + Math.floor(i / 3) * 16}
          width="12"
          height="12"
          rx="3"
          fill={[0, 2, 4, 5, 7, 9, 10, 13].includes(i) ? PLUM : CREAM}
          opacity={[0, 2, 4, 5, 7, 9, 10, 13].includes(i) ? 0.75 : 0.8}
        />
      ))}
      {/* pomodoro ring */}
      <circle cx="281" cy="135" r="17" fill="none" stroke={CREAM} strokeWidth="6" />
      <circle
        cx="281"
        cy="135"
        r="17"
        fill="none"
        stroke="#ff8fa3"
        strokeWidth="6"
        strokeDasharray={`${Math.PI * 34 * 0.7} ${Math.PI * 34}`}
        strokeLinecap="round"
        transform="rotate(-90 281 135)"
      />
    </Frame>
  );
}

function FaceMesh({ accent }: { accent: string }) {
  const cx = 104;
  const cy = 92;
  const jaw = Array.from({ length: 17 }, (_, i) => {
    const t = ((-15 + (i / 16) * 210) * Math.PI) / 180;
    return [cx + 46 * Math.cos(t), cy - 6 + 58 * Math.sin(t)];
  });
  const ring = (x: number, y: number, rx: number, ry: number, n: number) =>
    Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      return [x + rx * Math.cos(t), y + ry * Math.sin(t)];
    });
  const points = [
    ...jaw,
    ...ring(cx - 18, cy - 10, 9, 4.5, 6),
    ...ring(cx + 18, cy - 10, 9, 4.5, 6),
    ...ring(cx, cy + 28, 15, 6, 12),
    ...[0, 1, 2, 3].map((i) => [cx, cy - 4 + i * 7]),
    ...[-8, -4, 0, 4, 8].map((dx) => [cx + dx, cy + 18 - Math.abs(dx) * 0.3]),
    ...[-30, -24, -18, -12, -6].map((dx) => [cx + dx, cy - 26 + Math.abs(dx + 18) * 0.25]),
    ...[6, 12, 18, 24, 30].map((dx) => [cx + dx, cy - 26 + Math.abs(dx - 18) * 0.25]),
  ];
  return (
    <Frame accent={accent}>
      <rect x="40" y="18" width="128" height="144" rx="18" fill={CREAM} />
      <ellipse cx={cx} cy={cy + 2} rx="50" ry="64" fill="none" stroke={PLUM} strokeOpacity="0.15" strokeWidth="2" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.4" fill={i % 7 === 0 ? "#f6a57f" : PLUM} opacity="0.85" />
      ))}
      {/* attendance log */}
      {[0, 1, 2].map((row) => (
        <g key={row} transform={`translate(186 ${34 + row * 40})`}>
          <rect width="116" height="30" rx="10" fill={CREAM} />
          <circle cx="16" cy="15" r="8" fill={["#c9b6f0", "#86d3b0", "#f6a57f"][row]} />
          <rect x="30" y="9" width="44" height="5" rx="2.5" fill={PLUM} opacity="0.55" />
          <rect x="30" y="18" width="28" height="4" rx="2" fill={PLUM} opacity="0.25" />
          <circle cx="100" cy="15" r="7" fill={PLUM} />
          <path d="m96.5 15 2.5 2.5 4.5-5" stroke={CREAM} strokeWidth="2" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </Frame>
  );
}

const HAND: Array<[number, number]> = [
  [150, 160],
  [122, 145], [104, 128], [94, 112], [86, 98],
  [132, 110], [128, 84], [126, 66], [124, 50],
  [150, 106], [150, 78], [150, 58], [150, 40],
  [168, 110], [171, 84], [173, 66], [175, 52],
  [184, 118], [190, 98], [194, 84], [198, 72],
];
const BONES: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12],
  [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

function HandTracking({ accent }: { accent: string }) {
  return (
    <Frame accent={accent}>
      <rect x="60" y="20" width="172" height="150" rx="18" fill={CREAM} opacity="0.7" />
      {BONES.map(([a, b], i) => (
        <line key={i} x1={HAND[a][0]} y1={HAND[a][1]} x2={HAND[b][0]} y2={HAND[b][1]} stroke={PLUM} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      ))}
      {HAND.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 0 ? 5 : 4} fill={[4, 8].includes(i) ? "#ff8fa3" : "#a58fe0"} stroke={CREAM} strokeWidth="1.5" />
      ))}
      {/* swipe motion lines */}
      {[96, 112, 128].map((y, i) => (
        <line key={y} x1={74 + i * 4} y1={y} x2={98 + i * 4} y2={y} stroke="#ff8fa3" strokeWidth="3" strokeLinecap="round" opacity={0.9 - i * 0.2} />
      ))}
      {/* arrow keys */}
      {[
        { x: 270, y: 70, r: 0, on: false },
        { x: 248, y: 94, r: -90, on: true },
        { x: 270, y: 94, r: 180, on: false },
        { x: 292, y: 94, r: 90, on: false },
      ].map((key) => (
        <g key={`${key.x}-${key.y}`} transform={`translate(${key.x} ${key.y})`}>
          <rect x="-10" y="-10" width="20" height="20" rx="5" fill={key.on ? PLUM : CREAM} stroke={PLUM} strokeOpacity="0.2" />
          <path d="M0 -4l4 5h-8z" fill={key.on ? CREAM : PLUM} transform={`rotate(${key.r})`} />
        </g>
      ))}
    </Frame>
  );
}

function Code({ accent }: { accent: string }) {
  return (
    <Frame accent={accent}>
      <rect x="40" y="30" width="240" height="120" rx="16" fill={CREAM} />
      <path d="M120 70l-20 20 20 20M200 70l20 20-20 20M170 62l-20 56" stroke={PLUM} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </Frame>
  );
}

export default function ProjectArt({ art, accent }: { art: ArtKind; accent: string }) {
  switch (art) {
    case "vision-lab":
      return <VisionLab accent={accent} />;
    case "kanban":
      return <Kanban accent={accent} />;
    case "mood-wave":
      return <MoodWave accent={accent} />;
    case "face-mesh":
      return <FaceMesh accent={accent} />;
    case "hand-tracking":
      return <HandTracking accent={accent} />;
    default:
      return <Code accent={accent} />;
  }
}
