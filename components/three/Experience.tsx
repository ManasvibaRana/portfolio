"use client";

import { Component, Suspense, useRef, useState, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { HOME_CAMERA } from "@/data/sceneObjects";
import { isMobileDevice } from "@/lib/device";
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
  // Quality tiers, highest first. Desktop renders slightly above 1x for crisp edges.
  const tiers = mobile
    ? [{ dpr: [1, 1.5] as [number, number], effects: false }, { dpr: [1, 1] as [number, number], effects: false }]
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
        shadows={!mobile}
        dpr={quality.dpr}
        gl={{ antialias: !mobile, powerPreference: "high-performance" }}
        camera={{ position: HOME_CAMERA.position, fov: 30, near: 0.5, far: 80 }}
        onPointerMissed={() => studio.setState({ hovered: null })}
        aria-hidden
      >
        <PerformanceMonitor onDecline={decline} flipflops={3} onFallback={decline}>
          <Suspense fallback={null}>
            <Scene mobile={mobile} />
            {quality.effects && <Effects />}
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </WebGLBoundary>
  );
}
