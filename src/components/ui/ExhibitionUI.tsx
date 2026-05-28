"use client";

import { MessageComposer } from "@/components/ui/MessageComposer";

type ExhibitionUIProps = {
  onOpenInfo: () => void;
  onOpenBuy: () => void;
  soundOn: boolean;
  onToggleSound: () => void;
  onSendMessage: (message: string) => void;
  interactionEnabled?: boolean;
};

export function ExhibitionUI({
  onOpenInfo,
  onOpenBuy,
  soundOn,
  onToggleSound,
  onSendMessage,
  interactionEnabled = true,
}: ExhibitionUIProps) {
  return (
    <>
      <button
        type="button"
        onClick={onOpenInfo}
        className="ui-button fixed top-8 left-8 z-20 font-serif text-[13px] tracking-[0.06em] text-[#2a2824] md:top-12 md:left-12"
        aria-label="Открыть описание инсталляции"
      >
        токсичник
      </button>

      <button
        type="button"
        onClick={onOpenBuy}
        className="ui-button fixed top-8 right-8 z-20 font-serif text-[13px] tracking-[0.06em] text-[#2a2824] md:top-12 md:right-12"
        aria-label="Купить"
      >
        купить
      </button>

      <MessageComposer
        onSend={onSendMessage}
        disabled={!interactionEnabled}
      />

      <button
        type="button"
        onClick={onToggleSound}
        className="ui-button fixed bottom-8 right-8 z-20 font-serif text-[13px] tracking-[0.06em] text-[#2a2824] md:bottom-12 md:right-12"
        aria-label={soundOn ? "Выключить звук" : "Включить звук"}
        aria-pressed={soundOn}
      >
        {soundOn ? "звук · вкл" : "звук · выкл"}
      </button>
    </>
  );
}
