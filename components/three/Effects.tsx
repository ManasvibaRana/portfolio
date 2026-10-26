import { Bloom, EffectComposer, N8AO } from "@react-three/postprocessing";

/**
 * Desktop-only post-processing: soft ambient occlusion grounds every object
 * in the room, and bloom makes the fairy lights / desk lamp glow at night.
 */
export function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <N8AO aoRadius={0.8} distanceFalloff={0.6} intensity={3.6} quality="medium" color="#4a2f5e" halfRes />
      <Bloom mipmapBlur luminanceThreshold={1.15} luminanceSmoothing={0.25} intensity={0.8} />
    </EffectComposer>
  );
}
