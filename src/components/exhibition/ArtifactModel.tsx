"use client";

import { Center, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Group, MeshStandardMaterial, PointLight } from "three";

const MODEL_PATH = "/models/toxoc-1.glb";

useGLTF.preload(MODEL_PATH, false, true);

type ArtifactModelProps = {
  submissionPulse: number;
};

export function ArtifactModel({ submissionPulse }: ArtifactModelProps) {
  const groupRef = useRef<Group>(null);
  const innerLightRef = useRef<PointLight>(null);
  const reactionStart = useRef<number | null>(null);
  const emissiveMaterials = useRef<MeshStandardMaterial[]>([]);
  const { scene } = useGLTF(MODEL_PATH, false, true);

  const clonedScene = useMemo(() => {
    const materials: MeshStandardMaterial[] = [];
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.castShadow = true;
      child.receiveShadow = true;

      const meshMaterials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      meshMaterials.forEach((material) => {
        if (!(material instanceof THREE.MeshStandardMaterial)) return;
        material.roughness = Math.min(material.roughness ?? 0.72, 0.92);
        material.metalness = Math.min(material.metalness ?? 0, 0.08);
        materials.push(material);
      });
    });

    emissiveMaterials.current = materials;
    return clone;
  }, [scene]);

  const [modelScale, setModelScale] = useState(1);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const rotationOffset = useRef({ x: 0, y: 0 });
  const baseY = useRef(0);
  const shakeOffset = useRef({ x: 0, y: 0, z: 0, rx: 0, rz: 0 });
  const warmGlow = useRef(new THREE.Color("#e88a72"));
  const calmGlow = useRef(new THREE.Color("#e8b88a"));
  const toxicEmissive = useRef(new THREE.Color("#8a3f34"));
  const neutralEmissive = useRef(new THREE.Color("#000000"));

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
      setModelScale(1.85 / maxDim);
    }
  }, [clonedScene]);

  useEffect(() => {
    reactionStart.current = -1;
  }, [submissionPulse]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      pointerTarget.current.x = nx;
      pointerTarget.current.y = ny;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.elapsedTime;

    if (reactionStart.current === -1) {
      reactionStart.current = t;
    }

    const reactionElapsed =
      reactionStart.current === null ? 999 : t - reactionStart.current;
    const reacting = reactionElapsed < 2.8;
    const reactionStrength = reacting
      ? Math.exp(-reactionElapsed * 1.15)
      : 0;

    rotationOffset.current.x = THREE.MathUtils.damp(
      rotationOffset.current.x,
      pointerTarget.current.y * 0.12,
      2.2,
      delta,
    );
    rotationOffset.current.y = THREE.MathUtils.damp(
      rotationOffset.current.y,
      pointerTarget.current.x * 0.18,
      2.2,
      delta,
    );

    if (reacting) {
      const shake = reactionStrength * 0.07;
      shakeOffset.current.x = Math.sin(reactionElapsed * 38) * shake;
      shakeOffset.current.z = Math.cos(reactionElapsed * 33) * shake * 0.7;
      shakeOffset.current.y = Math.sin(reactionElapsed * 27) * shake * 0.35;
      shakeOffset.current.rx = Math.sin(reactionElapsed * 41) * shake * 0.55;
      shakeOffset.current.rz = Math.cos(reactionElapsed * 36) * shake * 0.4;
    } else {
      shakeOffset.current.x = THREE.MathUtils.damp(shakeOffset.current.x, 0, 6, delta);
      shakeOffset.current.z = THREE.MathUtils.damp(shakeOffset.current.z, 0, 6, delta);
      shakeOffset.current.y = THREE.MathUtils.damp(shakeOffset.current.y, 0, 6, delta);
      shakeOffset.current.rx = THREE.MathUtils.damp(shakeOffset.current.rx, 0, 6, delta);
      shakeOffset.current.rz = THREE.MathUtils.damp(shakeOffset.current.rz, 0, 6, delta);
    }

    group.rotation.y += delta * 0.06;
    group.rotation.x = rotationOffset.current.x + shakeOffset.current.rx;
    group.rotation.z = rotationOffset.current.y * 0.25 + shakeOffset.current.rz;

    const floatY = Math.sin(t * 0.35) * 0.04 + Math.sin(t * 0.17) * 0.015;
    group.position.x = shakeOffset.current.x;
    group.position.z = shakeOffset.current.z;
    group.position.y = THREE.MathUtils.damp(
      group.position.y,
      baseY.current + floatY + shakeOffset.current.y,
      3,
      delta,
    );

    const innerLight = innerLightRef.current;
    if (innerLight) {
      const baseIntensity = 1.4;
      const pulse = reacting
        ? 1 + Math.sin(reactionElapsed * 14) * 0.55 * reactionStrength
        : 0;
      innerLight.intensity = baseIntensity + pulse * 2.2;
      innerLight.color.lerp(
        reacting ? warmGlow.current : calmGlow.current,
        1 - Math.exp(-4 * delta),
      );
    }

    const emissiveStrength = reacting ? reactionStrength * 0.22 : 0;

    emissiveMaterials.current.forEach((material) => {
      material.emissive.lerp(
        reacting ? toxicEmissive.current : neutralEmissive.current,
        1 - Math.exp(-5 * delta),
      );
      material.emissiveIntensity = THREE.MathUtils.damp(
        material.emissiveIntensity,
        emissiveStrength,
        5,
        delta,
      );
    });
  });

  return (
    <Center disableZ>
      <group ref={groupRef} scale={modelScale}>
        <primitive object={clonedScene} />
        <pointLight
          ref={innerLightRef}
          position={[0, 0.15, 0.05]}
          intensity={1.4}
          color="#e8b88a"
          distance={2.2}
          decay={2}
        />
      </group>
    </Center>
  );
}
