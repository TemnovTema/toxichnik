"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { PointLight } from "three";

type ExhibitionLightingProps = {
  submissionPulse: number;
};

export function ExhibitionLighting({ submissionPulse }: ExhibitionLightingProps) {
  const accentRef = useRef<PointLight>(null);
  const reactionStart = useRef<number | null>(null);
  const warmColor = useRef(new THREE.Color("#d4846a"));
  const coolColor = useRef(new THREE.Color("#f0ebe3"));

  useEffect(() => {
    reactionStart.current = -1;
  }, [submissionPulse]);

  useFrame((state, delta) => {
    const light = accentRef.current;
    if (!light) return;

    if (reactionStart.current === -1) {
      reactionStart.current = state.clock.elapsedTime;
    }

    const elapsed =
      reactionStart.current === null
        ? 999
        : state.clock.elapsedTime - reactionStart.current;

    if (elapsed > 3.2) {
      light.intensity = THREE.MathUtils.damp(light.intensity, 0, 4, delta);
      return;
    }

    const wave = Math.sin(elapsed * 9) * Math.exp(-elapsed * 1.1);
    light.intensity = 0.25 + Math.max(0, wave) * 1.6;
    light.color.lerpColors(
      warmColor.current,
      coolColor.current,
      Math.min(1, elapsed / 2.4),
    );
  });

  return (
    <>
      <ambientLight intensity={0.42} color="#f0ebe3" />
      <hemisphereLight
        args={["#faf7f2", "#cfc6ba", 0.55]}
        position={[0, 6, 0]}
      />

      <directionalLight
        position={[4.5, 6, 3]}
        intensity={0.85}
        color="#fff8ef"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={24}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0004}
        shadow-radius={4}
      />

      <directionalLight
        position={[-3.5, 2.5, -2]}
        intensity={0.22}
        color="#e8dfd2"
      />

      <spotLight
        position={[0.8, 2.2, 4]}
        angle={0.42}
        penumbra={1}
        intensity={0.35}
        color="#f5ede2"
        castShadow={false}
      />

      <pointLight
        position={[0.2, 0.3, 0.6]}
        intensity={0.65}
        color="#d4a574"
        distance={3}
        decay={2}
      />

      <pointLight
        ref={accentRef}
        position={[0, 0.2, 0.4]}
        intensity={0}
        color="#d4846a"
        distance={4}
        decay={2}
      />
    </>
  );
}
