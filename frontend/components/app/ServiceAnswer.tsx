"use client";

import Link from "next/link";
import { type CSSProperties, useState } from "react";
import type { Service } from "@/lib/data";
import { useLang } from "@/lib/lang";
import { ArrowRightIcon, CheckIcon, CopyIcon, ExternalIcon, ShareIcon } from "../icons";
import ServiceIcon from "../ServiceIcon";

const delay = (n: number) => ({ "--d": `${n * 80}ms` }) as CSSProperties;

const buttonClass =
  "inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 py-2 text-xs font-medium transition-colors hover:border-brand hover:text-brand";

export default function ServiceAnswer({ service, text }: { service: Service; text: string }) {
  const { t, pick } = useLang();
  const [checked, setChecked] = useState<boolean[]>(() => service.docs.map(() => false));
  const [copied, setCopied] = useState(false);
  const done = checked.filter(Boolean).length;
  const total = service.docs.length;

  const toggle = (i: number) => setChecked((all) => all.map((v, j) => (j === i ? !v : v)));

  const checklist = [
    t.ui.shareIntro.replace("{title}", pick(service.title)),
    ...service.docs.map((d, i) => `${i + 1}. ${pick(d)}`),
    "",
    service.link.url,
  ].join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="space-y-5">
      <header className="reveal flex items-center gap-3.5" style={delay(0)}>
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand text-white">
          <ServiceIcon id={service.id} className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">{t.ui.categories[service.category]}</p>
          <h3 className="font-serif text-2xl leading-tight font-semibold">{pick(service.title)}</h3>
        </div>
      </header>

      <p className="reveal text-[15px] leading-7 text-ink/90" style={delay(1)}>
        {pick(service.summary)}
      </p>

      <section className="reveal rounded-xl border border-line bg-paper p-4 sm:p-5" style={delay(2)}>
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="font-serif text-lg font-semibold">{t.chat.papers}</h4>
          <span className="text-xs text-muted">{t.service.ready.replace("{n}", String(done)).replace("{m}", String(total))}</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${(done / total) * 100}%` }} />
        </div>
        <ul className="mt-3 space-y-0.5">
          {service.docs.map((d, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg px-2 py-2 text-sm leading-6 transition-colors hover:bg-white">
                <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} className="peer sr-only" />
                <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-sm border border-ink/40 bg-white text-white peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
                  {checked[i] && <CheckIcon className="size-3" />}
                </span>
                <span className={checked[i] ? "text-muted line-through" : ""}>{pick(d)}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="reveal" style={delay(3)}>
        <h4 className="font-serif text-lg font-semibold">{t.chat.steps}</h4>
        <ol className="mt-3">
          {service.steps.map((step, i) => (
            <li key={i} className="relative flex gap-3.5 pb-4 last:pb-0">
              {i < service.steps.length - 1 && <span aria-hidden className="absolute top-8 bottom-0 left-[0.9rem] w-px bg-line" />}
              <span className="relative z-10 grid size-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-semibold text-white">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm leading-6">{pick(step)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="reveal rounded-xl border-l-4 border-warn bg-warn-bg p-4" style={delay(4)}>
        <h4 className="font-serif text-base font-semibold text-warn">{t.chat.mistakes}</h4>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
          {service.mistakes.map((m, i) => (
            <li key={i}>{pick(m)}</li>
          ))}
        </ul>
      </section>

      <section className="reveal grid gap-3 sm:grid-cols-2" style={delay(5)}>
        <div className="rounded-xl border border-line p-3.5">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">{t.service.fee}</p>
          <p className="mt-1 text-sm leading-5">{t.service.fee_text}</p>
        </div>
        <div className="rounded-xl border border-line p-3.5">
          <p className="text-xs font-semibold tracking-wide text-muted uppercase">{t.service.time}</p>
          <p className="mt-1 text-sm leading-5">{t.service.time_text}</p>
        </div>
      </section>

      <footer className="reveal border-t border-line pt-4" style={delay(6)}>
        <div className="flex flex-wrap gap-2">
          <a
            href={service.link.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-brand-dark"
          >
            {t.service.official}
            <ExternalIcon className="size-3.5" />
          </a>
          <Link href={`/services/${service.id}`} className={buttonClass}>
            {t.ui.guide}
            <ArrowRightIcon className="size-3.5" />
          </Link>
          <a href={`https://wa.me/?text=${encodeURIComponent(checklist)}`} target="_blank" rel="noreferrer" className={buttonClass}>
            <ShareIcon className="size-3.5" />
            {t.ui.shareWhatsApp}
          </a>
          <button type="button" onClick={copy} className={buttonClass}>
            {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
            {copied ? t.chat.copied : t.chat.copy}
          </button>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted">
          {t.ui.source}: {service.link.label} · {t.chat.sampleNote}
        </p>
      </footer>
    </div>
  );
}
