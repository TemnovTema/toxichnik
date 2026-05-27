"use client";

import {
  EffectComposer,
  ChromaticAberration,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";

export function ExhibitionPostFX() {
  return (
    <EffectComposer multisampling={4}>
      <Noise
        opacity={0.028}
        blendFunction={BlendFunction.OVERLAY}
      />
      <ChromaticAberration
        offset={[0.00035, 0.00035]}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.22} darkness={0.35} />
    </EffectComposer>
  );
}
