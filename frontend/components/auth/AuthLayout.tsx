"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLang } from "@/lib/lang";
import LangSwitch from "../LangSwitch";
import LogoMark, { Wordmark } from "../Logo";
import { CheckIcon } from "../icons";
import BridgeIllustration from "./BridgeIllustration";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useLang();

  return (
    <div className="grid min-h-dvh bg-white lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand p-12 text-white lg:flex">
        <Link href="/" className="flex w-fit items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-white/15">
            <svg viewBox="0 0 32 32" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" className="size-7" aria-hidden>
              <path d="M6 21Q16 7 26 21M5 21H27" />
              <path d="M11.5 21v-3.4M16 21v-6M20.5 21v-3.4" strokeWidth="1.6" />
            </svg>
          </span>
          <span className="font-serif text-2xl font-semibold tracking-tight">SetuAI</span>
        </Link>

        <div>
          <h2 className="max-w-md font-serif text-4xl leading-[1.15] font-semibold">{t.auth.loginSideTitle}</h2>
          <ul className="mt-8 max-w-md space-y-4">
            {t.auth.sidePoints.map((point) => (
              <li key={point} className="flex items-start gap-3 leading-6 text-white/90">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/20">
                  <CheckIcon className="size-3" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <BridgeIllustration className="-mb-4 w-full max-w-lg text-white/35" />
      </aside>

      <div className="flex min-h-dvh flex-col">
        <div className="flex items-center justify-between gap-3 px-5 py-3 sm:px-8 sm:py-4">
          <Link href="/" className="flex items-center gap-2.5 lg:invisible">
            <LogoMark className="size-8" />
            <Wordmark />
          </Link>
          <LangSwitch />
        </div>

        <main id="main" className="flex flex-1 items-center justify-center px-5 pb-4 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </main>

        <p className="px-5 pb-4 text-center text-xs text-muted sm:px-8">
          {t.footer.notGov} ·{" "}
          <Link href="/admin/login" className="hover:text-brand hover:underline">
            {t.auth.adminLink}
          </Link>
        </p>
      </div>
    </div>
  );
}
