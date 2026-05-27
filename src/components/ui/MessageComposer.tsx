"use client";

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || sending || disabled) return;

    setSending(true);
    idRef.current += 1;
    setFlyingNote({ id: idRef.current, text: trimmed });

    window.setTimeout(() => {
      onSend(trimmed);
      setValue("");
      setFlyingNote(null);
      setSending(false);
    }, 1400);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="message-form fixed bottom-8 left-8 z-20 flex max-w-[min(92vw,380px)] items-end gap-3 md:bottom-12 md:left-12"
      >
        <label className="sr-only" htmlFor="toxic-message">
          Сообщение
        </label>
        <input
          id="toxic-message"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="напишите что-то злое"
          disabled={sending || disabled}
          maxLength={180}
          autoComplete="off"
          className="message-input min-w-0 flex-1 bg-transparent font-serif text-[13px] tracking-[0.02em] text-[#2a2824] outline-none placeholder:text-[#b5afa6] disabled:opacity-40"
        />
        <button
          type="submit"
          disabled={sending || disabled || !value.trim()}
          className="ui-button shrink-0 font-serif text-[13px] tracking-[0.06em] text-[#2a2824] disabled:opacity-35"
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
