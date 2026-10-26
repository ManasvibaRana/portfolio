import { useEffect } from "react";
import { Sparkles } from "@react-three/drei";
import { studio } from "@/lib/store";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { CameraRig } from "./CameraRig";
import { CharacterSpot } from "./CharacterSpot";
import { Desk, DESK_TOP } from "./Desk";
import { FairyLights } from "./FairyLights";
import { Interactive } from "./Interactive";
import { Lights } from "./Lights";
import { Room } from "./Room";
import { Shadowed } from "./Shadowed";
import { Bookshelf } from "./objects/Bookshelf";
import { Laptop } from "./objects/Laptop";
import { Mailbox } from "./objects/Mailbox";
import { SpeakerLamp } from "./objects/SpeakerLamp";
import { TrophyShelf } from "./objects/TrophyShelf";
import { Whiteboard } from "./objects/Whiteboard";

/** Tells the boot screen the scene is up, two frames after everything has mounted. */
function ReadySignal() {
  useEffect(() => {
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => studio.setState({ sceneReady: true }));
    });
    return () => {
      cancelAnimationFrame(frame);
      studio.setState({ sceneReady: false, booted: false });
    };
  }, []);
  return null;
}

export function Scene({ mobile }: { mobile: boolean }) {
  const reduced = useReducedMotion();

  return (
    <>
      <Lights shadows={!mobile} />
      <CameraRig />

      <Shadowed>
        <Room />
        <Desk />

        <Interactive id="laptop" position={[0.35, DESK_TOP, -1.9]} labelOffset={[0, 0.75, 0]}>
          <Laptop />
        </Interactive>
        <Interactive id="whiteboard" position={[-1.6, 2.25, -3.5]} labelOffset={[0, 0.85, 0.2]}>
          <Whiteboard />
        </Interactive>
        <Interactive id="bookshelf" position={[-3.25, 0, -0.3]} rotation={[0, Math.PI / 2, 0]} labelOffset={[0, 2.75, 0]}>
          <Bookshelf />
        </Interactive>
        <Interactive id="trophies" position={[-3.32, 2.3, 1.7]} rotation={[0, Math.PI / 2, 0]} labelOffset={[0, 0.65, 0]}>
          <TrophyShelf />
        </Interactive>
        <Interactive id="mailbox" position={[1.25, DESK_TOP, -1.45]} labelOffset={[0, 0.6, 0]}>
          <Mailbox />
        </Interactive>
        <Interactive id="speaker" position={[-0.45, DESK_TOP, -1.38]} labelOffset={[0, 0.55, 0]}>
          <SpeakerLamp />
        </Interactive>

        {/* character sits on the chair, facing the desk (hover over her to say hi) */}
        <CharacterSpot position={[0.35, 0, -2.42]} />
      </Shadowed>

      <FairyLights />
      <Sparkles
        count={mobile ? 24 : 60}
        scale={[6, 3, 6]}
        position={[0, 1.8, -0.3]}
        size={2.5}
        speed={reduced ? 0 : 0.25}
        noise={0.6}
        opacity={0.7}
        color="#fff3d6"
      />
      <ReadySignal />
    </>
  );
}
