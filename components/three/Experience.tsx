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
  // Resolution is chosen once and never changed mid-session: resizing a live
  // WebGL canvas shows a black frame. Desktop renders slightly above 1x for crisp
  // edges; modern phones near their native sharpness, weaker ones stay light.
  const [dpr] = useState<[number, number]>(() => (mobile ? (capableMobile ? [1.5, 2.5] : [1, 1.75]) : [1.25, 2]));
  const [effectsOn, setEffectsOn] = useState(!mobile);
  const effectsRef = useRef(!mobile);
  const declines = useRef(0);

  // Struggling? A desktop first switches its effects off (in place, no remount).
  // A phone that keeps struggling gets Recruiter mode, a clean page change
  // instead of a flicker. Ignored until the boot screen is gone (loading
  // hitches) and while a panel is open (the room deliberately stops rendering
  // then, see CameraRig).
  const decline = () => {
    const { booted, active } = studio.getState();
    if (!booted || active) return;
    if (effectsRef.current) {
      effectsRef.current = false;
      setEffectsOn(false);
      return;
    }
    declines.current += 1;
    if (mobile && declines.current >= 2) setMode("recruiter", { persist: false });
  };

  return (
    <WebGLBoundary>
      <Canvas
        flat
        shadows={!mobile || capableMobile}
        dpr={dpr}
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
            {!mobile && <Effects enabled={effectsOn} />}
          </Suspense>
        </PerformanceMonitor>
      </Canvas>
    </WebGLBoundary>
  );
}
