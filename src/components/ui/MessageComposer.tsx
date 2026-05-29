"use client";

import { resetMobileViewport } from "@/lib/resetMobileViewport";
import { FormEvent, useRef, useState } from "react";

type MessageComposerProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

type FlyingNote = {
  id: number;
  text: string;
};

export function MessageComposer({ onSend, disabled }: MessageComposerProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const [flyingNote, setFlyingNote] = useState<FlyingNote | null>(null);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || sending || disabled) return;

    resetMobileViewport();

    setSending(true);
    idRef.current += 1;
    setFlyingNote({ id: idRef.current, text: trimmed });

    window.setTimeout(() => {
      onSend(trimmed);
      setValue("");
      setFlyingNote(null);
      setSending(false);
      resetMobileViewport();
    }, 1400);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="message-form flex min-w-0 flex-1 items-center gap-3"
      >
        <label className="sr-only" htmlFor="toxic-message">
          Сообщение
        </label>
        <input
          ref={inputRef}
          id="toxic-message"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="напишите что-то злое"
          disabled={sending || disabled}
          maxLength={180}
          autoComplete="off"
          enterKeyHint="send"
          className="message-input min-w-0 flex-1 bg-transparent font-serif text-base leading-none tracking-[0.02em] text-[#2a2824] outline-none placeholder:text-[#8a847c] disabled:opacity-40 md:text-[13px]"
        />
        <button
          type="submit"
          disabled={sending || disabled || !value.trim()}
          className="ui-button message-submit shrink-0 font-serif text-[13px] leading-none tracking-[0.06em] text-[#2a2824] md:text-[13px]"
          onPointerDown={() => {
            inputRef.current?.blur();
          }}
        >
          {sending ? "…" : "отправить"}
        </button>
      </form>

      {flyingNote && (
        <div
          key={flyingNote.id}
          className="send-note pointer-events-none fixed bottom-[4.5rem] left-8 z-30 max-w-[220px] font-serif text-[12px] leading-snug text-[#4a4540] md:bottom-[5.5rem] md:left-12"
          aria-hidden
        >
          <span className="send-note-paper inline-block border border-[#2a2824]/10 bg-[#faf7f2]/90 px-3 py-2 shadow-[0_8px_24px_rgba(42,40,36,0.06)]">
            {flyingNote.text}
          </span>
        </div>
      )}
    </>
  );
}
