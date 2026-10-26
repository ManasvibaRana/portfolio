import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/lib/palette";
import { sfx } from "@/lib/lofi";
import { fx } from "@/lib/store";
import { setDark } from "@/lib/theme";
import { localHour, sampleDaylight, sunProgress } from "@/lib/timeOfDay";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Cat } from "./Cat";
import { clickable } from "./clickable";
import { Mat } from "./Mat";

// Room footprint: floor x/z in [-3.5, 3.5], back wall at z = -3.5, left wall at x = -3.5.
const WALL_H = 3.6;

export function Room() {
  return (
    <group>
      <Floor />
      {/* back wall */}
      <RoundedBox args={[7.2, WALL_H, 0.2]} radius={0.06} position={[-0.1, WALL_H / 2, -3.6]}>
        <Mat color={palette.peachWall} />
      </RoundedBox>
      {/* left wall */}
      <RoundedBox args={[0.2, WALL_H, 7.2]} radius={0.06} position={[-3.6, WALL_H / 2, -0.1]}>
        <Mat color={palette.lavenderWall} />
      </RoundedBox>
      {/* baseboards */}
      <mesh position={[0, 0.06, -3.48]}>
        <boxGeometry args={[7, 0.12, 0.04]} />
        <Mat color={palette.white} />
      </mesh>
      <mesh position={[-3.48, 0.06, 0]}>
        <boxGeometry args={[0.04, 0.12, 7]} />
        <Mat color={palette.white} />
      </mesh>

      <Rug />
      <Window />
      <WallClock />
      <Poster />
      <FloorPlant position={[2.85, 0, -2.85]} />
      <BeanBag />
    </group>
  );
}

function Floor() {
  const lines = useMemo(() => Array.from({ length: 13 }, (_, i) => -3 + i * 0.5), []);
  return (
    <group>
      <RoundedBox args={[7.2, 0.3, 7.2]} radius={0.08} position={[-0.1, -0.15, -0.1]}>
        <Mat color={palette.floor} />
      </RoundedBox>
      {lines.map((z) => (
        <mesh key={z} position={[0, 0.001, z]} userData={{ noShadow: true }}>
          <boxGeometry args={[7, 0.002, 0.014]} />
          <meshStandardMaterial color={palette.floorLine} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function Rug() {
  return (
    <group position={[0.4, 0, -1.4]} scale={[1.25, 1, 0.9]}>
      <mesh position={[0, 0.012, 0]}>
        <cylinderGeometry args={[1.7, 1.7, 0.02, 48]} />
        <Mat color={palette.lavender} />
      </mesh>
      <mesh position={[0, 0.024, 0]}>
        <cylinderGeometry args={[1.35, 1.35, 0.008, 48]} />
        <Mat color={palette.cream} />
      </mesh>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[1.0, 1.0, 0.006, 48]} />
        <Mat color={palette.pink} />
      </mesh>
    </group>
  );
}

const SKY_DAY = new THREE.Color("#ffd2a1");
const SKY_NIGHT = new THREE.Color("#2e2f6b");
const daySky = new THREE.Color();
const daySun = new THREE.Color();
const STARS: Array<[number, number, number]> = [
  [-0.5, 0.42, 0.012],
  [-0.12, 0.33, 0.009],
  [0.2, 0.45, 0.013],
  [0.48, 0.3, 0.01],
  [0.36, 0.08, 0.008],
  [-0.42, 0.05, 0.009],
  [0.05, 0.12, 0.007],
  [-0.22, -0.3, 0.008],
  [0.45, -0.32, 0.011],
];

function Window() {
  const sky = useRef<THREE.MeshBasicMaterial>(null);
  const sun = useRef<THREE.Mesh>(null);
  const moon = useRef<THREE.Mesh>(null);
  const stars = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const n = fx.night;
    // daytime sky follows the visitor's real local time
    const hour = localHour();
    sampleDaylight(hour, daySky, daySun);
    sky.current?.color.lerpColors(daySky, SKY_NIGHT, n);
    if (sun.current) {
      const p = sunProgress(hour);
      sun.current.position.set(-0.4 + p * 0.8, -0.27 + Math.sin(p * Math.PI) * 0.47, 0.11);
      sun.current.scale.setScalar(Math.max(0.001, 1 - n));
    }
    moon.current?.scale.setScalar(Math.max(0.001, n));
    if (stars.current) {
      stars.current.visible = n > 0.05;
      stars.current.children.forEach((star, i) => {
        star.scale.setScalar(n * (0.7 + 0.3 * Math.sin(clock.elapsedTime * 2 + i * 1.7)));
      });
    }
  });

  return (
    <group
      position={[1.9, 2.15, -3.5]}
      {...clickable(() => setDark(!document.documentElement.classList.contains("dark")))}
    >
      <RoundedBox args={[1.5, 1.35, 0.1]} radius={0.04} position={[0, 0, 0.05]}>
        <Mat color={palette.white} />
      </RoundedBox>
      <mesh position={[0, 0, 0.105]} userData={{ noShadow: true }}>
        <planeGeometry args={[1.3, 1.15]} />
        <meshBasicMaterial ref={sky} color={SKY_DAY} />
      </mesh>
      <mesh ref={sun} position={[0.28, -0.18, 0.11]} userData={{ noShadow: true }}>
        <circleGeometry args={[0.17, 32]} />
        <meshBasicMaterial color="#fff3c4" />
      </mesh>
      <mesh ref={moon} position={[-0.3, 0.24, 0.11]} userData={{ noShadow: true }}>
        <circleGeometry args={[0.12, 32]} />
        <meshBasicMaterial color="#fdf6e3" />
      </mesh>
      <group ref={stars} visible={false}>
        {STARS.map(([x, y, r]) => (
          <mesh key={`${x}${y}`} position={[x, y, 0.108]} userData={{ noShadow: true }}>
            <circleGeometry args={[r, 6]} />
            <meshBasicMaterial color="#fff8d6" />
          </mesh>
        ))}
      </group>
      {/* cross bars */}
      <mesh position={[0, 0, 0.13]}>
        <boxGeometry args={[0.05, 1.15, 0.04]} />
        <Mat color={palette.white} />
      </mesh>
      <mesh position={[0, 0, 0.13]}>
        <boxGeometry args={[1.3, 0.05, 0.04]} />
        <Mat color={palette.white} />
      </mesh>
      {/* sill */}
      <RoundedBox args={[1.7, 0.07, 0.24]} radius={0.03} position={[0, -0.71, 0.12]}>
        <Mat color={palette.white} />
      </RoundedBox>
      {/* rod + curtains */}
      <mesh position={[0, 0.84, 0.2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.022, 0.022, 2.2, 12]} />
        <Mat color={palette.woodDeep} />
      </mesh>
      {[-1, 1].map((side) => (
        <RoundedBox key={side} args={[0.34, 1.62, 0.07]} radius={0.03} position={[side * 0.9, 0.02, 0.2]}>
          <Mat color={palette.mint} />
        </RoundedBox>
      ))}
      {/* tiny succulent on the sill */}
      <group position={[-0.45, -0.67, 0.14]}>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.07, 0.055, 0.12, 16]} />
          <Mat color={palette.peach} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <icosahedronGeometry args={[0.075, 0]} />
          <Mat color={palette.mintDeep} flatShading />
        </mesh>
      </group>
    </group>
  );
}

function WallClock() {
  const hour = useRef<THREE.Group>(null);
  const minute = useRef<THREE.Group>(null);

  // Shows the visitor's real local time.
  useFrame(() => {
    const now = new Date();
    const m = now.getMinutes() + now.getSeconds() / 60;
    const h = (now.getHours() % 12) + m / 60;
    if (minute.current) minute.current.rotation.z = -(m / 60) * Math.PI * 2;
    if (hour.current) hour.current.rotation.z = -(h / 12) * Math.PI * 2;
  });

  return (
    <group position={[0.35, 2.85, -3.49]}>
      <mesh position={[0, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 40]} />
        <Mat color={palette.cream} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <torusGeometry args={[0.3, 0.035, 12, 40]} />
        <Mat color={palette.lavenderDeep} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.22, Math.cos(a) * 0.22, 0.065]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <Mat color={palette.peachDeep} />
          </mesh>
        );
      })}
      <group ref={hour} position={[0, 0, 0.07]}>
        <mesh position={[0, 0.07, 0]}>
          <boxGeometry args={[0.025, 0.14, 0.01]} />
          <Mat color={palette.plum} />
        </mesh>
      </group>
      <group ref={minute} position={[0, 0, 0.08]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[0.018, 0.2, 0.01]} />
          <Mat color={palette.plumSoft} />
        </mesh>
      </group>
      <mesh position={[0, 0, 0.09]}>
        <sphereGeometry args={[0.022, 10, 10]} />
        <Mat color={palette.peachDeep} />
      </mesh>
    </group>
  );
}

function Poster() {
  // Small framed pastel landscape on the left wall.
  return (
    <group position={[-3.49, 2.2, -2.45]} rotation={[0, Math.PI / 2, 0]}>
      <RoundedBox args={[0.8, 1.0, 0.05]} radius={0.02} position={[0, 0, 0.025]}>
        <Mat color={palette.white} />
      </RoundedBox>
      <mesh position={[0, 0, 0.052]}>
        <planeGeometry args={[0.66, 0.86]} />
        <Mat color={palette.sky} />
      </mesh>
      <mesh position={[0.14, 0.18, 0.055]}>
        <circleGeometry args={[0.1, 24]} />
        <Mat color={palette.butter} />
      </mesh>
      <mesh position={[-0.08, -0.22, 0.056]}>
        <circleGeometry args={[0.32, 3, Math.PI / 2]} />
        <Mat color={palette.mintDeep} />
      </mesh>
      <mesh position={[0.18, -0.27, 0.057]}>
        <circleGeometry args={[0.22, 3, Math.PI / 2]} />
        <Mat color={palette.lavenderDeep} />
      </mesh>
    </group>
  );
}

function FloorPlant({ position }: { position: [number, number, number] }) {
  const leaves = useMemo(
    () =>
      [
        [0, 0.95, 0, 0.28],
        [0.18, 0.8, 0.08, 0.2],
        [-0.16, 0.82, -0.06, 0.22],
        [0.05, 0.78, -0.18, 0.18],
        [-0.06, 1.15, 0.05, 0.18],
      ] as const,
    [],
  );
  const reduced = useReducedMotion();
  const [flowers, setFlowers] = useState(0);
  const flowerCount = useRef(0);
  const watering = useRef(false);
  const waterStart = useRef<number | null>(null);
  const waterRequested = useRef(false);
  const drops = useRef<Array<THREE.Mesh | null>>([]);
  const blooms = useRef<Array<THREE.Group | null>>([]);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((id) => window.clearTimeout(id)), []);

  // Click to water: drops fall into the pot, then a flower pops open (up to 3).
  const water = () => {
    if (watering.current) return;
    watering.current = true;
    waterRequested.current = true;
    void sfx("drop");
    timers.current.push(
      window.setTimeout(() => {
        watering.current = false;
        if (flowerCount.current < FLOWER_SPOTS.length) {
          flowerCount.current += 1;
          setFlowers(flowerCount.current);
          void sfx("pop");
        }
      }, 900),
    );
  };

  useFrame(({ clock }, dt) => {
    const t = clock.elapsedTime;
    if (waterRequested.current) {
      waterRequested.current = false;
      waterStart.current = t;
    }
    const elapsed = waterStart.current === null ? 99 : t - waterStart.current;
    drops.current.forEach((drop, i) => {
      if (!drop) return;
      const p = (elapsed - i * 0.12) / 0.6;
      drop.visible = !reduced && p >= 0 && p <= 1;
      drop.position.set((i - 1.5) * 0.06, 1.75 - p * p * 1.15, 0.05 + (i % 2) * 0.04);
    });
    blooms.current.forEach((bloom, i) => {
      if (!bloom) return;
      const target = i < flowers ? 1 : 0;
      const s = reduced ? target : THREE.MathUtils.damp(bloom.scale.x, target, 7, dt);
      bloom.scale.setScalar(Math.max(0.0001, s));
      bloom.visible = s > 0.01;
    });
  });

  return (
    <group position={position} {...clickable(water)}>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.26, 0.2, 0.5, 24]} />
        <Mat color={palette.peach} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <torusGeometry args={[0.25, 0.03, 8, 24]} />
        <Mat color={palette.peachDeep} />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.3, 8]} />
        <Mat color={palette.woodDeep} />
      </mesh>
      {leaves.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]}>
          <icosahedronGeometry args={[r, 0]} />
          <Mat color={i % 2 ? palette.mint : palette.mintDeep} flatShading />
        </mesh>
      ))}
      {/* water drops */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          ref={(el) => {
            drops.current[i] = el;
          }}
          visible={false}
          scale={[1, 1.4, 1]}
          userData={{ noShadow: true }}
        >
          <sphereGeometry args={[0.025, 10, 8]} />
          <meshStandardMaterial color="#8fc8ff" roughness={0.2} />
        </mesh>
      ))}
      {/* flowers that bloom after watering */}
      {FLOWER_SPOTS.map(([x, y, z, color], i) => (
        <group
          key={i}
          ref={(el) => {
            blooms.current[i] = el;
          }}
          position={[x, y, z]}
          rotation={[0.5, 0.8, 0]}
          scale={0.0001}
          visible={false}
        >
          {[0, 1, 2, 3, 4].map((p) => {
            const a = (p / 5) * Math.PI * 2;
            return (
              <mesh key={p} position={[Math.cos(a) * 0.04, Math.sin(a) * 0.04, 0]} scale={[1, 1, 0.5]}>
                <sphereGeometry args={[0.032, 10, 8]} />
                <Mat color={color} />
              </mesh>
            );
          })}
          <mesh position={[0, 0, 0.012]}>
            <sphereGeometry args={[0.026, 10, 8]} />
            <Mat color={palette.butter} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const FLOWER_SPOTS: Array<[number, number, number, string]> = [
  [0.12, 1.12, 0.17, palette.pink],
  [0.24, 0.9, 0.06, palette.lavender],
  [-0.05, 0.92, 0.24, palette.coral],
];

function BeanBag() {
  return (
    <group position={[2.1, 0, 1.5]}>
      <Cat position={[-0.02, 0.6, 0.02]} />
      <mesh position={[0, 0.3, 0]} scale={[1, 0.58, 1]}>
        <sphereGeometry args={[0.6, 32, 20]} />
        <Mat color={palette.peach} />
      </mesh>
      <mesh position={[-0.05, 0.52, 0.05]} scale={[1, 0.35, 1]}>
        <sphereGeometry args={[0.4, 24, 16]} />
        <Mat color={palette.peachDeep} />
      </mesh>
      {/* little heart cushion */}
      <mesh position={[0.62, 0.12, 0.35]} rotation={[0, -0.6, 0]} scale={[1, 0.45, 1]}>
        <sphereGeometry args={[0.18, 20, 14]} />
        <Mat color={palette.pink} />
      </mesh>
    </group>
  );
}
