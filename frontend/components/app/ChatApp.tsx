"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useChats } from "@/lib/chats";
import { services } from "@/lib/data";
import { useLang } from "@/lib/lang";
import ChatInput from "../ChatInput";
import Conversation from "../Conversation";
import { ArrowDownIcon } from "../icons";
import LogoMark from "../Logo";
import ServiceIcon from "../ServiceIcon";

const NEAR_BOTTOM = 120;

function greeting(t: ReturnType<typeof useLang>["t"], name: string) {
  const hour = new Date().getHours();
  const line = hour < 12 ? t.app.greetingMorning : hour < 17 ? t.app.greetingAfternoon : t.app.greetingEvening;
  return line.replace("{name}", name);
}

export default function ChatApp() {
  const { user } = useAuth();
  const { t, pick } = useLang();
  const { messages, isStreaming, opening, saveError, openError, send, stop, newChat } = useChats();
  const scrollRef = useRef<HTMLDivElement>(null);
  const follow = useRef(true);
  const started = useRef(false);
  const [showJump, setShowJump] = useState(false);
  const inChat = messages.length > 0;
  const firstName = user?.name.trim().split(/\s+/)[0] ?? "";
  const lastServiceId = messages.findLast((m) => m.role === "assistant")?.serviceId;
  const related = services.filter((s) => s.id !== lastServiceId).slice(0, 3);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      window.history.replaceState(null, "", window.location.pathname);
      newChat();
      send(q);
    }
  }, [newChat, send]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el && follow.current) el.scrollTo({ top: el.scrollHeight });
  }, [messages]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < NEAR_BOTTOM;
    follow.current = near;
    setShowJump(!near);
  };

  const jump = () => {
    follow.current = true;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  };

  const ask = (text: string) => {
    follow.current = true;
    send(text);
  };

  const notices = (
    <>
      {saveError && <p className="mb-2 text-center text-xs text-warn">{t.app.saveError}</p>}
      {openError && <p className="mb-2 text-center text-xs text-red-700">{t.app.openError}</p>}
    </>
  );

  if (opening) {
    return (
      <div className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-4 py-10 sm:px-6" aria-busy>
        <div className="ml-auto h-10 w-2/5 animate-pulse rounded-2xl bg-line/70" />
        <div className="h-48 animate-pulse rounded-2xl bg-line/50" />
      </div>
    );
  }

  if (!inChat) {
    return (
      <div className="flex min-h-0 flex-1 overflow-y-auto">
        <div className="m-auto w-full max-w-2xl px-4 py-10 sm:px-6">
          <LogoMark className="mx-auto size-11" />
          <h1 className="mt-5 text-center font-serif text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">{greeting(t, firstName)}</h1>
          <p className="mt-1.5 text-center text-muted">{t.app.prompt}</p>

          <div className="mt-7">
            {notices}
            <ChatInput isStreaming={isStreaming} followUp={false} large onSend={ask} onStop={stop} />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {services.slice(0, 4).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => ask(pick(s.prompt))}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-sm transition-colors hover:border-brand hover:text-brand"
              >
                <ServiceIcon id={s.id} className="size-4" />
                {pick(s.title)}
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted">{t.app.disclaimer}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative min-h-0 flex-1">
        <div ref={scrollRef} onScroll={onScroll} className="h-full overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
            <Conversation messages={messages} isStreaming={isStreaming} onAsk={ask} />
            {!isStreaming && (
              <div className="pb-8 sm:pl-11">
                <p className="text-sm font-semibold text-muted">{t.ui.related}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {related.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => ask(pick(s.prompt))}
                      className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 text-sm transition-colors hover:border-brand hover:text-brand"
                    >
                      <ServiceIcon id={s.id} className="size-4" />
                      {pick(s.title)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {showJump && (
          <button
            type="button"
            onClick={jump}
            aria-label={t.chat.jump}
            className="absolute bottom-4 left-1/2 grid size-10 -translate-x-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow-lg transition-colors hover:border-brand hover:text-brand"
          >
            <ArrowDownIcon />
          </button>
        )}
      </div>

      <div className="shrink-0 bg-paper px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6">
        <div className="mx-auto w-full max-w-3xl">
          {notices}
          <ChatInput isStreaming={isStreaming} followUp onSend={ask} onStop={stop} />
          <p className="mt-2 text-center text-xs text-muted">{t.app.disclaimer}</p>
        </div>
      </div>
    </div>
  );
}
