"use client";

import Link from "next/link";
import { useState } from "react";
import { services, type Service } from "@/lib/data";
import { useLang } from "@/lib/lang";
import { ArrowRightIcon, CheckIcon, CopyIcon, ExternalIcon, ShareIcon } from "./icons";
import ServiceIcon from "./ServiceIcon";

export default function ServiceDetail({ service }: { service: Service }) {
  const { t, pick } = useLang();
  const [checked, setChecked] = useState<boolean[]>(() => service.docs.map(() => false));
  const [copied, setCopied] = useState(false);
  const done = checked.filter(Boolean).length;
  const total = service.docs.length;

  const index = services.findIndex((s) => s.id === service.id);
  const previous = services[(index - 1 + services.length) % services.length];
  const next = services[(index + 1) % services.length];

  const toggle = (i: number) => setChecked((all) => all.map((v, j) => (j === i ? !v : v)));

  const checklistText = [
    t.ui.shareIntro.replace("{title}", pick(service.title)),
    ...service.docs.map((d, i) => `${i + 1}. ${pick(d)}`),
    "",
    service.link.url,
  ].join("\n");

  const copyList = async () => {
    try {
      await navigator.clipboard.writeText(checklistText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted print:hidden">
        <Link href="/services" className="font-medium text-brand hover:underline">
          {t.service.all}
        </Link>
        <span className="mx-2">/</span>
        <span>{pick(service.title)}</span>
      </nav>

      <div className="mt-6 flex items-start gap-4 sm:gap-5">
        <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-brand text-white sm:size-16">
          <ServiceIcon id={service.id} className="size-8" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t.ui.categories[service.category]}</p>
          <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">{pick(service.title)}</h1>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{pick(service.summary)}</p>

      <p className="mt-6 max-w-3xl rounded-md border border-brand/20 bg-tint px-4 py-3 text-sm leading-6 print:hidden">
        {t.service.banner}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-10 print:hidden">
          <section>
            <h2 className="font-serif text-2xl font-semibold">{t.service.who}</h2>
            <p className="mt-2 leading-7">{pick(service.who)}</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl font-semibold">{t.service.steps}</h2>
            <ol className="mt-5">
              {service.steps.map((step, i) => (
                <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < service.steps.length - 1 && <span aria-hidden className="absolute top-9 bottom-0 left-4 w-px bg-line" />}
                  <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-ink font-serif text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <p className="pt-0.5 leading-7">{pick(step)}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-lg border-l-4 border-warn bg-warn-bg p-5">
            <h2 className="font-serif text-xl font-semibold text-warn">{t.service.mistakes}</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 leading-7">
              {service.mistakes.map((m, i) => (
                <li key={i}>{pick(m)}</li>
              ))}
            </ul>
          </section>

          <div className="grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
            <Link
              href={`/services/${previous.id}`}
              className="group rounded-lg border border-line bg-white p-4 transition hover:border-brand"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted">← {t.ui.previous}</span>
              <span className="mt-1 block font-serif text-lg font-semibold group-hover:text-brand">{pick(previous.title)}</span>
            </Link>
            <Link
              href={`/services/${next.id}`}
              className="group rounded-lg border border-line bg-white p-4 text-left transition hover:border-brand sm:text-right"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-muted">{t.ui.next} →</span>
              <span className="mt-1 block font-serif text-lg font-semibold group-hover:text-brand">{pick(next.title)}</span>
            </Link>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-white p-5 shadow-md print:border-0 print:shadow-none">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-xl font-semibold">{t.service.docs}</h2>
              <span className="text-sm text-muted">
                {t.service.ready.replace("{n}", String(done)).replace("{m}", String(total))}
              </span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-brand transition-all duration-300"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>

            <ul className="mt-4 space-y-1">
              {service.docs.map((d, i) => (
                <li key={i}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-md px-2 py-2 text-sm leading-6 hover:bg-tint/60">
                    <input type="checkbox" checked={checked[i]} onChange={() => toggle(i)} className="peer sr-only" />
                    <span className="mt-1 grid size-4 shrink-0 place-items-center rounded-sm border border-ink/40 text-white peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand">
                      {checked[i] && <CheckIcon className="size-3" />}
                    </span>
                    <span className={checked[i] ? "text-muted line-through" : ""}>{pick(d)}</span>
                  </label>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-3 border-t border-line pt-4 text-sm leading-6">
              <div>
                <dt className="font-semibold">{t.service.fee}</dt>
                <dd className="text-muted">{t.service.fee_text}</dd>
              </div>
              <div>
                <dt className="font-semibold">{t.service.time}</dt>
                <dd className="text-muted">{t.service.time_text}</dd>
              </div>
              <div>
                <dt className="font-semibold">{t.service.verified}</dt>
                <dd className="text-muted">{t.service.sample}</dd>
              </div>
            </dl>

            <div className="mt-5 space-y-2.5 print:hidden">
              <a
                href={service.link.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
              >
                {t.service.official}
                <ExternalIcon />
              </a>
              <Link
                href={`/chat?q=${encodeURIComponent(pick(service.prompt))}`}
                className="flex items-center justify-center gap-2 rounded-lg border border-ink/30 px-4 py-2.5 text-sm font-medium hover:border-brand hover:text-brand"
              >
                {t.service.ask}
                <ArrowRightIcon />
              </Link>
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(checklistText)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium hover:border-brand hover:text-brand"
                >
                  <ShareIcon className="size-3.5" />
                  {t.ui.shareWhatsApp}
                </a>
                <button
                  type="button"
                  onClick={copyList}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-xs font-medium hover:border-brand hover:text-brand"
                >
                  {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
                  {copied ? t.ui.copied : t.ui.copyList}
                </button>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full rounded-md px-4 py-2 text-sm text-muted hover:text-ink"
              >
                {t.service.print}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
