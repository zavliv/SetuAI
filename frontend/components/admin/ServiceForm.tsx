"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Category } from "@/lib/data";
import { strings } from "@/lib/i18n";
import { buttonOutline, buttonPrimary, ErrorNote, Field, inputClass, PageHeader } from "./ui";

export type Text = { en: string; hi: string };

export type ServiceDoc = {
  slug: string;
  category: Category;
  title: Text;
  note: Text;
  summary: Text;
  who: Text;
  prompt: Text;
  docs: Text[];
  steps: Text[];
  mistakes: Text[];
  link: { label: string; url: string };
  keywords: string[];
  updated_at?: string | null;
};

const CATEGORIES = Object.keys(strings.en.ui.categories) as Category[];

const lines = (list: Text[], lang: "en" | "hi") => list.map((t) => t[lang]).join("\n");

function zip(en: string, hi: string): Text[] {
  const enLines = en.split("\n").map((l) => l.trim()).filter(Boolean);
  const hiLines = hi.split("\n").map((l) => l.trim());
  return enLines.map((line, i) => ({ en: line, hi: hiLines[i] ?? "" }));
}

type Form = {
  slug: string;
  category: Category;
  title: Text;
  note: Text;
  summary: Text;
  who: Text;
  prompt: Text;
  docs: Text;
  steps: Text;
  mistakes: Text;
  linkLabel: string;
  linkUrl: string;
  keywords: string;
};

function toForm(s?: ServiceDoc): Form {
  const empty = { en: "", hi: "" };
  if (!s) {
    return {
      slug: "",
      category: "identity",
      title: empty,
      note: empty,
      summary: empty,
      who: empty,
      prompt: empty,
      docs: empty,
      steps: empty,
      mistakes: empty,
      linkLabel: "",
      linkUrl: "https://",
      keywords: "",
    };
  }
  return {
    slug: s.slug,
    category: s.category,
    title: s.title,
    note: s.note,
    summary: s.summary,
    who: s.who,
    prompt: s.prompt,
    docs: { en: lines(s.docs, "en"), hi: lines(s.docs, "hi") },
    steps: { en: lines(s.steps, "en"), hi: lines(s.steps, "hi") },
    mistakes: { en: lines(s.mistakes, "en"), hi: lines(s.mistakes, "hi") },
    linkLabel: s.link.label,
    linkUrl: s.link.url,
    keywords: s.keywords.join(", "),
  };
}

export default function ServiceForm({ initial }: { initial?: ServiceDoc }) {
  const router = useRouter();
  const editing = !!initial;
  const [form, setForm] = useState<Form>(() => toForm(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));
  const setText = (key: "title" | "note" | "summary" | "who" | "prompt" | "docs" | "steps" | "mistakes", lang: "en" | "hi", value: string) =>
    setForm((f) => ({ ...f, [key]: { ...f[key], [lang]: value } }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      slug: form.slug.trim(),
      category: form.category,
      title: form.title,
      note: form.note,
      summary: form.summary,
      who: form.who,
      prompt: form.prompt,
      docs: zip(form.docs.en, form.docs.hi),
      steps: zip(form.steps.en, form.steps.hi),
      mistakes: zip(form.mistakes.en, form.mistakes.hi),
      link: { label: form.linkLabel.trim(), url: form.linkUrl.trim() },
      keywords: form.keywords.split(",").map((k) => k.trim()).filter(Boolean),
    };
    try {
      if (editing) await api(`/api/admin/services/${initial!.slug}`, { method: "PUT", body: payload });
      else await api("/api/admin/services", { method: "POST", body: payload });
      router.push("/admin/services");
    } catch (err) {
      setError(err instanceof ApiError ? (err.status === 0 ? "Could not reach the backend." : err.message) : "Could not save.");
      setSaving(false);
    }
  };

  const pair = (
    label: string,
    key: "title" | "note" | "summary" | "who" | "prompt" | "docs" | "steps" | "mistakes",
    opts: { rows?: number; hint?: string } = {},
  ) => (
    <div className="grid gap-4 sm:grid-cols-2">
      {(["en", "hi"] as const).map((lang) => (
        <Field key={lang} label={`${label} (${lang === "en" ? "English" : "Hindi"})`} hint={lang === "en" ? opts.hint : undefined}>
          {opts.rows ? (
            <textarea
              value={form[key][lang]}
              onChange={(e) => setText(key, lang, e.target.value)}
              rows={opts.rows}
              lang={lang}
              className={inputClass}
            />
          ) : (
            <input value={form[key][lang]} onChange={(e) => setText(key, lang, e.target.value)} lang={lang} className={inputClass} />
          )}
        </Field>
      ))}
    </div>
  );

  return (
    <>
      <PageHeader
        title={editing ? "Edit service" : "New service"}
        subtitle={editing ? initial!.slug : "Fill in English. Hindi is optional."}
        actions={
          <Link href="/admin/services" className={buttonOutline}>
            Back to services
          </Link>
        }
      />

      <form onSubmit={submit} className="space-y-6 rounded-xl border border-line bg-white p-5 shadow-sm sm:p-7">
        {error && <ErrorNote error={error} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Slug" hint={editing ? "The slug cannot be changed." : "Lowercase letters, numbers and dashes. Used in the page address."}>
            <input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              disabled={editing}
              required
              pattern="[a-z0-9][a-z0-9\-]{1,39}"
              placeholder="pan"
              className={`${inputClass} font-mono disabled:bg-paper disabled:text-muted`}
            />
          </Field>
          <Field label="Category">
            <select value={form.category} onChange={(e) => set("category", e.target.value as Category)} className={inputClass}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {strings.en.ui.categories[c]}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {pair("Title", "title")}
        {pair("Short note", "note")}
        {pair("Summary", "summary", { rows: 3 })}
        {pair("Who can apply", "who", { rows: 2 })}
        {pair("Chat prompt", "prompt", { hint: "The question shown on suggestion buttons." })}
        {pair("Papers needed", "docs", { rows: 5, hint: "One item per line. Hindi lines match English lines by order." })}
        {pair("Steps", "steps", { rows: 6, hint: "One step per line." })}
        {pair("Mistakes to avoid", "mistakes", { rows: 3, hint: "One item per line." })}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Official site name">
            <input value={form.linkLabel} onChange={(e) => set("linkLabel", e.target.value)} required className={inputClass} />
          </Field>
          <Field label="Official site address">
            <input
              value={form.linkUrl}
              onChange={(e) => set("linkUrl", e.target.value)}
              type="url"
              required
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Keywords" hint="Comma separated. Words that help the chat find this service.">
          <input value={form.keywords} onChange={(e) => set("keywords", e.target.value)} className={inputClass} />
        </Field>

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <button type="submit" disabled={saving} className={buttonPrimary}>
            {saving ? "Saving..." : editing ? "Save changes" : "Create service"}
          </button>
          <Link href="/admin/services" className={buttonOutline}>
            Cancel
          </Link>
        </div>
      </form>
    </>
  );
}
