"use client";

import { useEffect, useRef, useState } from "react";

type BuyOverlayProps = {
  open: boolean;
  onClose: () => void;
};

export function BuyOverlay({ open, onClose }: BuyOverlayProps) {
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
      aria-labelledby="buy-overlay-text"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#2a2824]/10 backdrop-blur-[6px]"
        aria-label="Закрыть"
        onClick={onClose}
      />

      <div
        ref={panelRef}
        className={`relative z-10 w-full max-w-md border border-[var(--panel-border)] bg-[var(--panel)] px-8 py-12 text-center shadow-[0_24px_80px_rgba(42,40,36,0.06)] backdrop-blur-md md:px-12 md:py-14 ${
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

        <p
          id="buy-overlay-text"
          className="font-serif text-[22px] leading-[1.45] tracking-[-0.01em] text-[#2a2824] md:text-[26px]"
        >
          Зло нельзя купить, только совершить
        </p>
      </div>
    </div>
  );
}
