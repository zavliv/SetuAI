"use client";

import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useState } from "react";
import { useLang } from "@/lib/lang";
import { ArrowRightIcon } from "./icons";

export default function AskBox() {
  const router = useRouter();
  const { t } = useLang();
  const [value, setValue] = useState("");

  const go = () => {
    const q = value.trim();
    router.push(q ? `/chat?q=${encodeURIComponent(q)}` : "/chat");
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    go();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      go();
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-ink/20 bg-white p-4 shadow-sm transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15 sm:p-5"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        rows={2}
        maxLength={2000}
        placeholder={t.home.askPlaceholder}
        aria-label={t.home.askPlaceholder}
        className="block w-full resize-none bg-transparent text-lg leading-7 outline-none placeholder:text-muted/70 sm:text-xl sm:leading-8"
      />
      <div className="mt-3 flex items-center justify-between gap-4 border-t border-line pt-3">
        <span className="hidden text-xs text-muted sm:block">{t.chat.hint}</span>
        <button
          type="submit"
          className="group ml-auto inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          {t.home.askButton}
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </form>
  );
}
