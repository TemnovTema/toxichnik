"use client";

import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

export function ExhibitionCamera() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const dragging = useRef(false);
  const targetOffset = useRef(new THREE.Vector3(0, 0.05, 0));

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onStart = () => {
      dragging.current = true;
    };
    const onEnd = () => {
      dragging.current = false;
    };

    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);
    return () => {
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
    };
  }, []);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const t = state.clock.elapsedTime;

    if (!dragging.current) {
      const azimuth =
        controls.getAzimuthalAngle() +
        Math.sin(t * 0.11) * 0.00035 * delta * 60;
      const polar =
        controls.getPolarAngle() +
        Math.cos(t * 0.085) * 0.00018 * delta * 60;
      controls.setAzimuthalAngle(azimuth);
      controls.setPolarAngle(
        THREE.MathUtils.clamp(polar, Math.PI / 2.35, Math.PI / 1.95),
      );
    }

    targetOffset.current.set(
      Math.sin(t * 0.12) * 0.03,
      0.05 + Math.sin(t * 0.08 + 0.6) * 0.02,
      Math.cos(t * 0.1) * 0.02,
    );
    controls.target.lerp(targetOffset.current, 1 - Math.exp(-1.2 * delta));
    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.04}
      rotateSpeed={0.28}
      minPolarAngle={Math.PI / 2.35}
      maxPolarAngle={Math.PI / 1.95}
      minAzimuthAngle={-0.35}
      maxAzimuthAngle={0.35}
    />
  );
}
