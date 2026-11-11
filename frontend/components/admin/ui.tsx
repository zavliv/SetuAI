import type { ReactNode } from "react";
import type { ApiError } from "@/lib/api";
import { errorText } from "@/lib/useApi";

export const inputClass =
  "w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/15";

export const buttonPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-60";

export const buttonOutline =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-ink/25 bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:opacity-60";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-semibold">{label}</span>
      <div className="mt-1.5">{children}</div>
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function ErrorNote({ error }: { error: ApiError | Error | string }) {
  const text = typeof error === "string" ? error : errorText(error);
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800">
      {text}
    </p>
  );
}

export function Loading() {
  return (
    <div className="space-y-3" aria-busy>
      <div className="h-24 animate-pulse rounded-xl bg-line/60" />
      <div className="h-48 animate-pulse rounded-xl bg-line/60" />
    </div>
  );
}

export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  return new Date(value).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
