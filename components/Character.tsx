"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { useAnimations, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import ChibiPlaceholder from "@/components/three/ChibiPlaceholder";
import { useStudio } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";

const MODEL_URL = "/models/character.glb";

// Set by next.config.ts when public/models/character.glb exists.
const HAS_MODEL = process.env.NEXT_PUBLIC_HAS_CHARACTER_MODEL === "1";

/**
 * Fit the GLB to the chair. The parent group's origin is the floor directly
 * under the chair seat, with the desk in front along +z. Tweak these if your
 * exported model sits too high/low or faces the wrong way.
 */
const MODEL_TRANSFORM = {
  position: [0, 0, 0] as [number, number, number],
  rotation: [0, 0, 0] as [number, number, number],
  scale: 0.85,
};

const FADE = 0.4;

function CharacterModel() {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL, true, true);
  const { actions, mixer } = useAnimations(animations, group);
  const reduced = useReducedMotion();
  const panelOpen = useStudio((s) => s.active !== null);
  const booted = useStudio((s) => s.booted);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  // Intro: play "Wave" once the boot screen is gone (skipped with reduced motion).
  useEffect(() => {
    const wave = actions.Wave;
    if (introDone || !booted) return;
    if (reduced || !wave) {
      setIntroDone(true);
      return;
    }
    for (const action of Object.values(actions)) {
      if (action && action !== wave) action.fadeOut(FADE);
    }
    wave.reset().setLoop(THREE.LoopOnce, 1);
    wave.clampWhenFinished = true;
    wave.fadeIn(FADE).play();

    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action === wave) setIntroDone(true);
    };
    mixer.addEventListener("finished", onFinished);
    return () => mixer.removeEventListener("finished", onFinished);
  }, [actions, mixer, reduced, introDone, booted]);

  // Clicking her replays the wave.
  const waveRequest = useStudio((s) => s.waveRequest);
  useEffect(() => {
    if (waveRequest > 0 && !reduced && actions.Wave) setIntroDone(false);
  }, [waveRequest, reduced, actions]);

  // Then loop "Typing", or "Idle" while a panel is open / motion is reduced.
  useEffect(() => {
    if (!introDone) return;
    const target = (panelOpen || reduced ? actions.Idle : actions.Typing) ?? actions.Idle ?? actions.Typing;
    if (!target) return;
    for (const action of Object.values(actions)) {
      if (action && action !== target) action.fadeOut(FADE);
    }
    target.reset().fadeIn(FADE).play();
  }, [actions, introDone, panelOpen, reduced]);

  return (
    <group ref={group} {...MODEL_TRANSFORM}>
      <primitive object={scene} />
    </group>
  );
}

class ModelBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[Character] Could not load character.glb — using the placeholder.", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * The studio character. Uses /public/models/character.glb (clips "Idle",
 * "Typing", "Wave") when present, otherwise a procedural chibi placeholder.
 */
export default function Character() {
  if (!HAS_MODEL) return <ChibiPlaceholder />;
  // No inner Suspense: loading the GLB holds the boot screen until she's ready.
  return (
    <ModelBoundary fallback={<ChibiPlaceholder />}>
      <CharacterModel />
    </ModelBoundary>
  );
}

if (HAS_MODEL) useGLTF.preload(MODEL_URL, true, true);
