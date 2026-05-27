"use client";

import { useEffect, useRef, useState } from "react";

type InfoOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function InfoOverlay({ open, onClose }: InfoOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setLeaving(false);
      setVisible(true);
      return;
    }
    if (visible) {
      setLeaving(true);
      const timer = window.setTimeout(() => {
        setVisible(false);
        setLeaving(false);
      }, 700);
      return () => window.clearTimeout(timer);
    }
  }, [open, visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-6 md:p-12"
      role="dialog"
      aria-modal="true"
      aria-labelledby="overlay-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#2a2824]/10 backdrop-blur-[6px]"
        aria-label="Закрыть"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className={`relative z-10 w-full max-w-lg border border-[var(--panel-border)] bg-[var(--panel)] px-8 py-10 shadow-[0_24px_80px_rgba(42,40,36,0.06)] backdrop-blur-md md:px-10 md:py-12 ${
          leaving ? "overlay-leave" : "overlay-enter"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="ui-button absolute top-5 right-5 font-serif text-[18px] leading-none text-[#6b6560]"
          aria-label="Закрыть панель"
        >
          ×
        </button>

        <p className="mb-3 font-serif text-[10px] tracking-[0.28em] text-[#6b6560] uppercase">
          Объект исследования
        </p>

        <h2
          id="overlay-title"
          className="mb-6 font-serif text-[32px] leading-none tracking-[-0.02em] text-[#2a2824] md:text-[36px]"
        >
          Токсичник
        </h2>

        <p className="mb-10 font-serif text-[15px] leading-[1.75] text-[#4a4540] md:text-[16px]">
          Токсичник — объектное исследование сетевой ненависти как формы бытового
          ритуала. Проект переносит злой комментарий из цифровой среды в
          осязаемую: сообщение становится бумажной запиской, а канал
          коммуникации — скворечником, подменяющим почтовый ящик. Внутреннее
          пространство объекта превращается в метафору среды, где накопленная
          агрессия не исчезает, а оседает, свивается и начинает формировать
          собственную материальную экосистему.
        </p>

        <div className="flex flex-col gap-1 font-serif text-[11px] tracking-[0.18em] text-[#8a847c] uppercase">
          <span>2026</span>
          <span>digital artifact</span>
          <span>prototype object</span>
        </div>
      </div>
    </div>
  );
}
