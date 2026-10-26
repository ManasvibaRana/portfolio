"use client";

import { Component, Suspense, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { HOME_CAMERA } from "@/data/sceneObjects";
import { isCapableMobile, isMobileDevice } from "@/lib/device";
import { setMode } from "@/lib/mode";
import { studio } from "@/lib/store";
import { Effects } from "./Effects";
import { Scene } from "./Scene";

/** Falls back to Recruiter mode if WebGL can't start or the scene crashes. */
class WebGLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[Studio] 3D scene failed — switching to Recruiter mode.", error);
    setMode("recruiter", { persist: false });
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** The WebGL canvas. Loaded client-side only (see StudioApp). */
export default function Experience() {
  const [mobile] = useState(isMobileDevice);
  const [capableMobile] = useState(() => mobile && isCapableMobile());
  // Quality tiers, highest first. Desktop renders slightly above 1x for crisp edges;
  // modern phones render near their native sharpness, weaker ones stay light.
  const tiers = mobile
    ? capableMobile
      ? [
          { dpr: [1.5, 2.5] as [number, number], effects: false },
          { dpr: [1.25, 1.75] as [number, number], effects: false },
          { dpr: [1, 1.25] as [number, number], effects: false },
        ]
      : [
          { dpr: [1, 1.75] as [number, number], effects: false },
          { dpr: [1, 1.25] as [number, number], effects: false },
        ]
    : [
        { dpr: [1.25, 2] as [number, number], effects: true },
        { dpr: [1.25, 2] as [number, number], effects: false },
        { dpr: [1, 1.5] as [number, number], effects: false },
      ];
  const [tier, setTier] = useState(0);
  const tierRef = useRef(0);
  const quality = tiers[tier];

  // Struggling? Step down a tier. A phone that still can't keep up gets Recruiter mode.
  // Ignored until the boot screen is gone (loading hitches) and while a panel is
  // open (the room deliberately stops rendering then, see CameraRig).
  const decline = () => {
    const { booted, active } = studio.getState();
    if (!booted || active) return;
    if (tierRef.current < tiers.length - 1) {
      tierRef.current += 1;
      setTier(tierRef.current);
    } else if (mobile) {
      setMode("recruiter", { persist: false });
    }
  };

  return (
    <WebGLBoundary>
      <Canvas
        flat
        shadows={!mobile || capableMobile}
        dpr={quality.dpr}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: HOME_CAMERA.position, fov: 30, near: 0.5, far: 80 }}
        onPointerMissed={() => studio.setState({ hovered: null })}
        aria-hidden
      >
        {/* Only step down when it's genuinely struggling (<24 fps). The default
            (50-90 fps) dropped fast 120 Hz phones to the lowest quality. */}
        <PerformanceMonitor bounds={() => [24, 50]} onDecline={decline} flipflops={3} onFallback={decline}>
          <Suspense fallback={null}>
            <Scene mobile={mobile} shadows={!mobile || capableMobile} />
            {quality.effects && <Effects />}
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </WebGLBoundary>
  );
}
