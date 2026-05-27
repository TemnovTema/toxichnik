"use client";

import { useEffect, useRef } from "react";

const TRACK_SRC = "/audio/hollow-white-silence.mp3";
const TARGET_VOLUME = 0.55;
const FADE_MS = 1800;

type AmbientAudioProps = {
  enabled: boolean;
};

export function AmbientAudio({ enabled }: AmbientAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIdRef = useRef(0);

  useEffect(() => {
    const audio = new Audio(TRACK_SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    const tryPlay = () => {
      if (!audioRef.current) return;
      void startPlayback(audioRef.current);
    };

    window.addEventListener("pointerdown", tryPlay, { once: true });

    return () => {
      window.removeEventListener("pointerdown", tryPlay);
      fadeIdRef.current += 1;
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (enabled) {
      void startPlayback(audio);
      fadeVolume(audio, TARGET_VOLUME, FADE_MS, fadeIdRef);
      return;
    }

    fadeVolume(audio, 0, FADE_MS, fadeIdRef, () => {
      audio.pause();
    });
  }, [enabled]);

  return null;
}

async function startPlayback(audio: HTMLAudioElement) {
  try {
    await audio.play();
  } catch {
    /* autoplay blocked until user gesture */
  }
}

function fadeVolume(
  audio: HTMLAudioElement,
  target: number,
  duration: number,
  fadeIdRef: { current: number },
  onComplete?: () => void,
) {
  const fadeId = ++fadeIdRef.current;
  const from = audio.volume;
  const start = performance.now();

  const tick = (now: number) => {
    if (fadeId !== fadeIdRef.current) return;

    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - (1 - t) ** 2;
    audio.volume = from + (target - from) * eased;

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }

    audio.volume = target;
    onComplete?.();
  };

  requestAnimationFrame(tick);
}
