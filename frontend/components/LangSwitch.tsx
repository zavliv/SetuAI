"use client";

import { useLang } from "@/lib/lang";

export default function LangSwitch() {
  const { lang, setLang, t } = useLang();

  return (
    <div role="group" aria-label={t.nav.language} className="flex overflow-hidden rounded-md border border-line bg-white text-sm">
      {(["en", "hi"] as const).map((code) => (
        <button
          key={code}
          type="button"
          aria-pressed={lang === code}
          onClick={() => setLang(code)}
          className={`px-3 py-1.5 font-medium transition-colors ${lang === code ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
        >
          {code === "en" ? "EN" : "हिं"}
        </button>
      ))}
    </div>
  );
}
