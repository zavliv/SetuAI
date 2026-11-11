"use client";

import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@/lib/chats";
import { getService, services } from "@/lib/data";
import { useLang } from "@/lib/lang";
import ServiceAnswer from "./app/ServiceAnswer";
import { CheckIcon, CopyIcon } from "./icons";
import LogoMark from "./Logo";
import ServiceIcon from "./ServiceIcon";

const markdownComponents: Components = {
  table: ({ node: _node, ...props }) => (
    <div className="overflow-x-auto">
      <table {...props} />
    </div>
  ),
  a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
};

const prose = [
  "prose max-w-none text-[15px] leading-7 text-ink [&>:first-child]:!mt-0 [&>:last-child]:!mb-0",
  "prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-li:marker:text-brand",
  "prose-headings:mb-1.5 prose-headings:mt-5 prose-headings:font-serif prose-headings:font-semibold prose-headings:text-ink prose-h3:text-lg",
  "prose-strong:text-ink prose-a:text-brand prose-a:underline-offset-2 prose-hr:border-line",
  "prose-code:rounded prose-code:bg-tint prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
].join(" ");

const actionClass =
  "inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand";

type Props = {
  messages: ChatMessage[];
  isStreaming: boolean;
  onAsk?: (text: string) => void;
};

export default function Conversation({ messages, isStreaming, onAsk }: Props) {
  const { t, pick } = useLang();

  return (
    <div className="flex flex-col gap-8 py-8" aria-live="polite">
      {messages.map((m, i) => {
        if (m.role === "user") {
          return (
            <div
              key={m.id}
              className="max-w-[85%] self-end whitespace-pre-wrap rounded-2xl rounded-br-sm bg-brand px-4 py-2.5 text-[15px] leading-6 text-white shadow-sm"
            >
              {m.text}
            </div>
          );
        }

        const isLast = i === messages.length - 1;
        const waiting = isStreaming && isLast && !m.text;
        const done = !(isStreaming && isLast);
        const service = m.serviceId ? getService(m.serviceId) : undefined;

        let body;
        if (waiting) {
          body = (
            <div role="status" className="flex items-center gap-2.5 py-1">
              <span className="flex items-center gap-1">
                <span className="typing-dot size-1.5 rounded-full bg-brand" />
                <span className="typing-dot size-1.5 rounded-full bg-brand" />
                <span className="typing-dot size-1.5 rounded-full bg-brand" />
              </span>
              <span className="shimmer-text text-sm font-medium">{t.chat.checking}</span>
            </div>
          );
        } else if (service) {
          body = <ServiceAnswer service={service} text={m.text} />;
        } else {
          body = (
            <>
              <div className={prose}>
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {m.text}
                </ReactMarkdown>
              </div>
              {done && m.text && (
                <div className="mt-4">
                  {onAsk && (
                    <>
                      <p className="text-xs font-semibold text-muted">{t.ui.tryAsking}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {services.slice(0, 6).map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => onAsk(pick(s.prompt))}
                            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-sm transition-colors hover:border-brand hover:text-brand"
                          >
                            <ServiceIcon id={s.id} className="size-4" />
                            {pick(s.title)}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                  <div className="mt-4">
                    <CopyButton text={m.text} />
                  </div>
                </div>
              )}
            </>
          );
        }

        return (
          <article key={m.id} className="flex gap-3">
            <LogoMark className="mt-0.5 size-8 shrink-0" />
            <div className="min-w-0 flex-1">{body}</div>
          </article>
        );
      })}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <button type="button" onClick={copy} className={actionClass}>
      {copied ? <CheckIcon /> : <CopyIcon />}
      {copied ? t.chat.copied : t.chat.copy}
    </button>
  );
}
