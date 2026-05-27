"use client";

import { useEffect, useRef, useState } from "react";

type LoadingScreenProps = {
  progress: number;
  label: string;
  exiting?: boolean;
};

export function LoadingScreen({
  progress,
  label,
  exiting = false,
}: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const targetRef = useRef(0);

  useEffect(() => {
    targetRef.current = progress;
  }, [progress]);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      setDisplayProgress((current) => {
        const target = targetRef.current;
        const next = current + (target - current) * 0.12;
        return Math.abs(target - next) < 0.4 ? target : next;
      });
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const value = Math.min(100, Math.max(0, Math.round(displayProgress)));

  return (
    <div
      className={`loader-screen fixed inset-0 z-50 flex flex-col bg-[#f3f1ec] ${
        exiting ? "loader-screen-exit" : "loader-screen-enter"
      }`}
      aria-live="polite"
      aria-busy={!exiting}
    >
      <div className="flex flex-1 flex-col justify-between p-8 md:p-12">
        <p className="font-serif text-[13px] tracking-[0.06em] text-[#2a2824]">
          токсичник
        </p>

        <div className="mx-auto w-full max-w-xs text-center md:max-w-sm">
          <p className="mb-8 font-serif text-[11px] tracking-[0.32em] text-[#8a847c] uppercase">
            {label}
          </p>

          <div className="mx-auto h-px w-full max-w-[180px] overflow-hidden bg-[#2a2824]/8">
            <div
              className="loader-bar h-full bg-[#2a2824]/30"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>

        <p className="text-right font-serif text-[10px] tracking-[0.24em] text-[#b5afa6] tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}
