"use client";

import Link from "next/link";
import { useLang } from "@/lib/lang";
import BridgeDivider from "./BridgeDivider";
import LogoMark, { Wordmark } from "./Logo";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="mt-auto bg-white print:hidden">
      <BridgeDivider />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto]">
        <div className="max-w-xl">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <Wordmark />
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{t.home.eyebrow}. {t.home.schemeText}</p>
          <p className="mt-4 text-sm leading-6 text-muted">
            <span className="font-medium text-ink">{t.footer.notGov}</span> {t.footer.disclaimer}
          </p>
        </div>

        <nav className="flex gap-6 text-sm font-medium md:flex-col md:gap-2">
          <Link href="/login" className="hover:text-brand hover:underline">
            {t.auth.login}
          </Link>
          <Link href="/signup" className="hover:text-brand hover:underline">
            {t.auth.signup}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
