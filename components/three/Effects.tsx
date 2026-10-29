import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import type { EffectComposer as EffectComposerImpl } from "postprocessing";
import * as THREE from "three";

const rendererSize = new THREE.Vector2();

/**
 * Desktop-only post-processing: soft ambient occlusion grounds every object
 * in the room.
 *
 * No bloom: its mipmap blur smears a single invalid pixel across the screen,
 * which showed up as black flashes while moving the mouse. The fairy lights
 * and lamp glow fine without it.
 *
 * It stays mounted for the whole session and is switched with `enabled`:
 * mounting or unmounting the composer mid-session showed a black frame.
 */
export function Effects({ enabled }: { enabled: boolean }) {
  const composer = useRef<EffectComposerImpl>(null);
  const gl = useThree((s) => s.gl);

  // The composer only resizes its buffers in an effect, i.e. after the canvas
  // has already been resized and drawn, which shows a half-black frame on
  // every resize. Resize them right before rendering instead (this runs at
  // priority 0, ahead of the composer's own render at priority 1).
  useFrame(() => {
    const c = composer.current;
    if (c && (c.inputBuffer.width !== gl.domElement.width || c.inputBuffer.height !== gl.domElement.height)) {
      gl.getSize(rendererSize);
      c.setSize(rendererSize.width, rendererSize.height);
    }
  });

  return (
    <EffectComposer ref={composer} enabled={enabled} multisampling={4}>
      <N8AO aoRadius={0.8} distanceFalloff={0.6} intensity={3.6} quality="medium" color="#4a2f5e" halfRes />
    </EffectComposer>
  );
}
