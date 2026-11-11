"use client";

import { useState } from "react";
import { useLang } from "@/lib/lang";
import { EyeIcon, EyeOffIcon } from "../icons";

export const fieldClass =
  "w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-brand/15";

export function passwordScore(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return Math.max(1, Math.min(score, 4));
}

type Labels = { show: string; hide: string; capsLock: string };

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  autoComplete: string;
  hint?: string;
  showStrength?: boolean;
  labels?: Labels;
};

export default function PasswordField({ id, label, value, onChange, onBlur, error, autoComplete, hint, showStrength, labels }: Props) {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const [caps, setCaps] = useState(false);
  const text: Labels = labels ?? { show: t.auth.show, hide: t.auth.hide, capsLock: t.auth.capsLock };
  const score = passwordScore(value);
  const level = score <= 1 ? "weak" : score <= 3 ? "okay" : "strong";
  const levelColor = { weak: "bg-red-500", okay: "bg-amber-500", strong: "bg-emerald-600" }[level];
  const levelText = { weak: t.auth.weak, okay: t.auth.okay, strong: t.auth.strong }[level];

  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setCaps(false);
            onBlur?.();
          }}
          onKeyDown={(e) => setCaps(e.getModifierState("CapsLock"))}
          onKeyUp={(e) => setCaps(e.getModifierState("CapsLock"))}
          aria-invalid={!!error}
          aria-describedby={`${id}-help`}
          className={`${fieldClass} pr-12 ${error ? "border-red-500" : "border-ink/20"}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? text.hide : text.show}
          aria-pressed={visible}
          className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md p-1.5 text-muted transition-colors hover:text-brand"
        >
          {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>

      <div id={`${id}-help`} className="mt-1 space-y-1 text-[13px]">
        {caps && <p className="text-warn">{text.capsLock}</p>}
        {error ? (
          <p className="text-red-700">{error}</p>
        ) : (
          hint && !showStrength && <p className="text-muted">{hint}</p>
        )}
        {showStrength && (
          <div>
            <div className="flex gap-1.5" aria-hidden>
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${value && i <= score ? levelColor : "bg-line"}`} />
              ))}
            </div>
            <p className="mt-1 flex justify-between gap-3 text-xs text-muted">
              <span>{hint}</span>
              {value && (
                <span aria-live="polite">
                  {t.auth.strengthLabel}: <span className="font-medium text-ink">{levelText}</span>
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
