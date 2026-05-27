"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { preloadExhibition, type PreloadStage } from "@/lib/preloadExhibition";
import { ExhibitionUI } from "@/components/ui/ExhibitionUI";
import { BuyOverlay } from "@/components/ui/BuyOverlay";
import { InfoOverlay } from "@/components/ui/InfoOverlay";
import { LoadingScreen } from "@/components/ui/LoadingScreen";

const ExhibitionCanvas = dynamic(
  () =>
    import("@/components/exhibition/ExhibitionCanvas").then(
      (mod) => mod.ExhibitionCanvas,
    ),
  { ssr: false },
);

type AppPhase = "loading" | "exiting" | "scene";

const LOADER_EXIT_MS = 1100;

export function ExhibitionExperience() {
  const [phase, setPhase] = useState<AppPhase>("loading");
  const [sceneVisible, setSceneVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("инициализация");
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [buyOverlayOpen, setBuyOverlayOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [submissionPulse, setSubmissionPulse] = useState(0);
  const startedRef = useRef(false);

  const handleSendMessage = useCallback(() => {
    setSubmissionPulse((count) => count + 1);
  }, []);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let revealTimer: number | undefined;
    let exitTimer: number | undefined;

    preloadExhibition((stage: PreloadStage) => {
      setProgress(stage.progress);
      setLabel(stage.label);
    })
      .then(() => {
        setPhase("exiting");

        revealTimer = window.setTimeout(() => {
          setSceneVisible(true);
        }, LOADER_EXIT_MS * 0.42);

        exitTimer = window.setTimeout(() => {
          setPhase("scene");
        }, LOADER_EXIT_MS);
      })
      .catch(() => {
        setLabel("ошибка загрузки");
        setProgress(0);
      });

    return () => {
      if (revealTimer) window.clearTimeout(revealTimer);
      if (exitTimer) window.clearTimeout(exitTimer);
    };
  }, []);

  const closeOverlay = useCallback(() => setOverlayOpen(false), []);
  const closeBuyOverlay = useCallback(() => setBuyOverlayOpen(false), []);

  useEffect(() => {
    if (!overlayOpen && !buyOverlayOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeBuyOverlay();
        closeOverlay();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen, buyOverlayOpen, closeOverlay, closeBuyOverlay]);

  const showLoader = phase !== "scene";
  const showScene = phase !== "loading";

  return (
    <div className="fixed inset-0 bg-[#f3f1ec]">
      {showScene && (
        <div
          className={`scene-shell absolute inset-0 ${
            sceneVisible ? "scene-shell-visible" : "scene-shell-hidden"
          }`}
        >
          <ExhibitionCanvas
            soundOn={soundOn}
            submissionPulse={submissionPulse}
          />
          <ExhibitionUI
            onOpenInfo={() => setOverlayOpen(true)}
            onOpenBuy={() => setBuyOverlayOpen(true)}
            soundOn={soundOn}
            onToggleSound={() => setSoundOn((v) => !v)}
            onSendMessage={handleSendMessage}
            interactionEnabled={sceneVisible}
          />
          <InfoOverlay open={overlayOpen} onClose={closeOverlay} />
          <BuyOverlay open={buyOverlayOpen} onClose={closeBuyOverlay} />
        </div>
      )}

      {showLoader && (
        <LoadingScreen
          progress={progress}
          label={label}
          exiting={phase === "exiting"}
        />
      )}
    </div>
  );
}
