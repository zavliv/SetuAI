"use client";

import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/lang";
import { ArrowUpIcon, StopIcon } from "./icons";

type Props = {
  isStreaming: boolean;
  followUp: boolean;
  large?: boolean;
  onSend: (text: string) => void;
  onStop: () => void;
};

const MAX_HEIGHT = 180;

export default function ChatInput({ isStreaming, followUp, large = false, onSend, onStop }: Props) {
  const { t } = useLang();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`;
  }, [text]);

  useEffect(() => {
    if (!isStreaming && window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
  }, [isStreaming]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (isStreaming || !text.trim()) return;
    onSend(text);
    setText("");
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div>
      <form
        onSubmit={submit}
        className={`flex items-end gap-2 border border-ink/20 bg-white pl-5 shadow-md transition focus-within:border-brand focus-within:shadow-lg focus-within:ring-4 focus-within:ring-brand/15 ${large ? "rounded-2xl p-3 pl-5" : "rounded-2xl p-2"}`}
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={large ? 2 : 1}
          maxLength={2000}
          placeholder={followUp ? t.chat.followUp : t.chat.placeholder}
          aria-label={t.chat.placeholder}
          className={`w-0 flex-1 resize-none bg-transparent outline-none placeholder:text-muted/80 ${large ? "py-2 text-base leading-6" : "py-2.5 text-base leading-6"}`}
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-ink/30 px-4 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
          >
            <StopIcon />
            {t.chat.stop}
          </button>
        ) : (
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:bg-line disabled:text-muted"
          >
            {t.chat.send}
            <ArrowUpIcon />
          </button>
        )}
      </form>
      <p className="mt-2 hidden text-xs text-muted sm:block">{t.chat.hint}</p>
    </div>
  );
}
