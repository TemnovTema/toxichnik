"use client";

import { Canvas } from "@react-three/fiber";
import { SceneContent } from "@/components/exhibition/SceneContent";
import { AmbientAudio } from "@/components/exhibition/AmbientAudio";

type ExhibitionCanvasProps = {
  soundOn: boolean;
  submissionPulse: number;
};

export function ExhibitionCanvas({
  soundOn,
  submissionPulse,
}: ExhibitionCanvasProps) {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0.4, -0.35, 5.2], fov: 38, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#f3f1ec" }}
      >
        <color attach="background" args={["#f3f1ec"]} />
        <SceneContent submissionPulse={submissionPulse} />
      </Canvas>
      <AmbientAudio enabled={soundOn} />
    </>
  );
}
