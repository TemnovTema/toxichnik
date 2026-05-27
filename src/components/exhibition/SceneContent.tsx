"use client";

import { ContactShadows } from "@react-three/drei";
import { Suspense, lazy } from "react";
import { ArtifactModel } from "@/components/exhibition/ArtifactModel";
import { ExhibitionCamera } from "@/components/exhibition/ExhibitionCamera";
import { ExhibitionLighting } from "@/components/exhibition/ExhibitionLighting";

const ExhibitionPostFX = lazy(
  () =>
    import("@/components/exhibition/ExhibitionPostFX").then((mod) => ({
      default: mod.ExhibitionPostFX,
    })),
);

type SceneContentProps = {
  submissionPulse: number;
};

export function SceneContent({ submissionPulse }: SceneContentProps) {
  return (
    <>
      <ExhibitionLighting submissionPulse={submissionPulse} />
      <ExhibitionCamera />

      <Suspense fallback={null}>
        <ArtifactModel submissionPulse={submissionPulse} />
      </Suspense>

      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.28}
        scale={12}
        blur={2.5}
        far={4.5}
        resolution={256}
        frames={1}
        color="#3a3530"
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.16, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>

      <Suspense fallback={null}>
        <ExhibitionPostFX />
      </Suspense>
    </>
  );
}
