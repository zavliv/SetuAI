"use client";

import { useLang } from "@/lib/lang";
import ServiceDirectory from "./ServiceDirectory";

export default function ServicesView() {
  const { t } = useLang();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">{t.home.servicesTitle}</h1>
      <p className="mt-3 mb-8 text-lg text-muted">{t.home.servicesIntro}</p>
      <ServiceDirectory showFilters />
    </div>
  );
}
