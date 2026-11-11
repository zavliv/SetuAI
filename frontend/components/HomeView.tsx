"use client";

import Link from "next/link";
import { services } from "@/lib/data";
import { useLang } from "@/lib/lang";
import { schemes } from "@/lib/schemes";
import AskBox from "./AskBox";
import { ArrowRightIcon, ChatIcon, CheckIcon, ExternalIcon, ListCheckIcon, QuestionIcon, ShieldIcon } from "./icons";
import ServiceDirectory from "./ServiceDirectory";

const wrap = "mx-auto w-full max-w-6xl px-4 sm:px-6";

const stepIcons = [<ChatIcon key="chat" />, <ListCheckIcon key="list" />, <ExternalIcon key="link" className="size-6" />];
const trustIcons = [<ShieldIcon key="shield" className="size-6" />, <ExternalIcon key="link" className="size-6" />, <QuestionIcon key="q" />];
const previewSchemes = [schemes[0], schemes[1], schemes[2]];

function SectionHeader({
  eyebrow,
  title,
  sub,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-lg leading-8 text-muted">{sub}</p>}
    </div>
  );
}

export default function HomeView() {
  const { t, pick } = useLang();
  const examples = [services[0], services[1], services[2], services[7]];

  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto w-full max-w-3xl px-4 pt-16 pb-14 text-center sm:px-6 sm:pt-24 sm:pb-20">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">{t.home.eyebrow}</p>

          <h1 className="mt-5 font-serif text-5xl leading-[1.06] font-semibold tracking-tight sm:text-6xl">
            {t.home.headlineStart}
            <span className="block text-brand">{t.home.headlineEnd}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted">{t.home.intro}</p>

          <div className="mx-auto mt-9 max-w-2xl text-left">
            <AskBox />
          </div>

          <p className="mt-6 text-sm text-muted">
            {t.home.tryLabel}:{" "}
            {examples.map((s, i) => (
              <span key={s.id}>
                {i > 0 && <span className="mx-2.5 text-line">|</span>}
                <Link href={`/chat?q=${encodeURIComponent(pick(s.prompt))}`} className="whitespace-nowrap font-medium text-ink underline-offset-4 hover:text-brand hover:underline">
                  {pick(s.title)}
                </Link>
              </span>
            ))}
          </p>

          <p className="mt-10 text-xs tracking-wide text-muted">{t.home.micro}</p>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className={`${wrap} py-20`}>
          <SectionHeader eyebrow={t.home.howEyebrow} title={t.home.howTitle} sub={t.home.howSub} />

          <ol className="relative mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
            <span aria-hidden className="absolute top-[3.5rem] right-[16.6%] left-[16.6%] hidden border-t border-dashed border-ink/20 md:block" />
            {t.home.how.map((step, i) => (
              <li key={i} className="relative rounded-2xl border border-line bg-paper p-7 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full border border-line bg-white text-brand shadow-sm">
                  {stepIcons[i]}
                </span>
                <p className="mt-5 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                  {t.home.stepLabel} {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 font-serif text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 leading-7 text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <div className={`${wrap} py-20`}>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow={t.home.servicesEyebrow} title={t.home.servicesTitle} sub={t.home.servicesIntro} align="left" />
            <Link href="/services" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
              {t.home.viewAll}
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
          <ServiceDirectory chips />
        </div>
      </section>

      <section className="border-y border-line bg-tint/50">
        <div className={`${wrap} grid grid-cols-1 items-center gap-12 py-20 lg:grid-cols-2 lg:gap-20`}>
          <div className="min-w-0">
            <SectionHeader eyebrow={t.home.schemeEyebrow} title={t.home.schemeTitle} sub={t.home.schemeText} align="left" />
            <ul className="mt-7 space-y-3">
              {t.home.schemePoints.map((point) => (
                <li key={point} className="flex items-center gap-3 font-medium">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <CheckIcon className="size-3.5" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <Link
              href="/schemes"
              className="group mt-8 inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              {t.home.schemeButton}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="min-w-0 rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-7" aria-hidden>
            <p className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">{t.home.schemePreviewTitle}</p>
            <dl className="mt-4 divide-y divide-line">
              {[
                [t.schemes.age, "28"],
                [t.schemes.income, t.schemes.incomeOptions.lt1],
                [t.schemes.work, t.schemes.workOptions.farmer],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <dt className="text-muted">{label}</dt>
                  <dd className="rounded-md bg-tint px-2.5 py-1 font-medium text-brand">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-5 border-t border-line pt-5 font-serif text-lg font-semibold">
              {t.ui.found.replace("{n}", String(previewSchemes.length))}
            </p>
            <ul className="mt-3 space-y-2.5">
              {previewSchemes.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 rounded-lg border border-line px-3.5 py-2.5 text-sm">
                  <span className="font-medium">{pick(item.title)}</span>
                  <span className="shrink-0 rounded-full bg-tint px-2.5 py-0.5 text-xs font-medium text-brand">{t.schemes.may}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className={`${wrap} py-20`}>
          <SectionHeader eyebrow={t.home.trustEyebrow} title={t.home.trustTitle} />

          <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {t.home.trust.map((item, i) => (
              <div key={item.title} className="rounded-2xl border border-line bg-paper p-7">
                <span className="grid size-12 place-items-center rounded-xl bg-white text-brand shadow-sm ring-1 ring-line">
                  {trustIcons[i]}
                </span>
                <h3 className="mt-5 font-serif text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 leading-7 text-muted">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-6 text-muted">{t.home.trustNote}</p>
        </div>
      </section>
    </>
  );
}
