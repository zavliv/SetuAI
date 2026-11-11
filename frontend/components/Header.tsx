"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";
import LangSwitch from "./LangSwitch";
import LogoMark, { Wordmark } from "./Logo";

export default function Header() {
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper print:hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-30 focus:rounded-md focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        {t.ui.skip}
      </a>

      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark className="size-8" />
          <Wordmark className="hidden min-[420px]:inline" />
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <LangSwitch />

          <Link href="/login" className="text-sm font-medium hover:text-brand">
            {t.auth.login}
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark sm:px-4 sm:py-2"
          >
            {t.auth.signup}
          </Link>
        </div>
      </div>
    </header>
  );
}
