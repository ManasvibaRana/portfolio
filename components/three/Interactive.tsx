import { useRef, type CSSProperties, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { objectOrder, sceneObjects, type ObjectId, type Vec3 } from "@/data/sceneObjects";
import { studio, useStudio } from "@/lib/store";
import { InteractiveContext } from "./Mat";

interface InteractiveProps {
  id: ObjectId;
  position?: Vec3;
  rotation?: Vec3;
  /** Where the floating label sits, in the object's local space. */
  labelOffset?: Vec3;
  children: ReactNode;
}

/** Hoverable / clickable room object: glow, slight lift and a floating label. */
export function Interactive({ id, position, rotation, labelOffset = [0, 1, 0], children }: InteractiveProps) {
  const lift = useRef<THREE.Group>(null);
  const hovered = useStudio((s) => s.hovered === id);
  const intro = useStudio((s) => s.introLabels && s.active === null && s.hovered === null);
  // "Where to look" hotspot: shown until this object has been opened, and
  // stepped aside whenever the label takes its place or a panel is open.
  const showHotspot = useStudio(
    (s) => s.booted && !s.introLabels && s.active === null && s.hovered !== id && !s.visited.includes(id),
  );

  useFrame((_, dt) => {
    if (!lift.current) return;
    const target = studio.getState().hovered === id ? 0.04 : 0;
    lift.current.position.y = THREE.MathUtils.damp(lift.current.position.y, target, 10, dt);
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    studio.setState({ hovered: id });
    document.body.style.cursor = "pointer";
  };

  const onOut = () => {
    if (studio.getState().hovered === id) studio.setState({ hovered: null });
    document.body.style.cursor = "";
  };

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    studio.setState({ active: id, hovered: null });
    document.body.style.cursor = "";
  };

  return (
    <group position={position} rotation={rotation}>
      <group ref={lift} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
        <InteractiveContext.Provider value={id}>{children}</InteractiveContext.Provider>
      </group>
      {(hovered || intro) && (
        <Html position={labelOffset} center zIndexRange={[30, 0]} style={{ pointerEvents: "none" }}>
          <span
            className={intro ? "studio-label studio-label-intro" : "studio-label"}
            style={intro ? { animationDelay: `${objectOrder.indexOf(id) * 130}ms` } : undefined}
          >
            {sceneObjects[id].label}
          </span>
        </Html>
      )}
      {showHotspot && (
        <Html position={labelOffset} center zIndexRange={[25, 0]}>
          {/* Decorative shortcut; keyboard and screen-reader users have the dock. */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden
            className="hotspot"
            style={{ "--hotspot-delay": `${objectOrder.indexOf(id) * 0.3}s` } as CSSProperties}
            onClick={() => studio.setState({ active: id, hovered: null })}
          >
            <span className="hotspot-core" />
          </button>
        </Html>
      )}
    </group>
  );
}
