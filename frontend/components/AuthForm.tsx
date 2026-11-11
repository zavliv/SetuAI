"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useLang } from "@/lib/lang";
import AuthLayout from "./auth/AuthLayout";
import PasswordField, { fieldClass } from "./auth/PasswordField";
import Stepper from "./auth/Stepper";
import { ArrowRightIcon } from "./icons";

type Mode = "login" | "signup";
type Field = "name" | "email" | "password";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function safeNext(): string | null {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { t } = useLang();
  const { user, loading, login, signup } = useAuth();
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<{ text: string; admin?: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const alertRef = useRef<HTMLDivElement>(null);
  const firstRef = useRef<HTMLInputElement>(null);

  useEffect(() => setSearch(window.location.search), []);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) firstRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!loading && user && !submitting) router.replace(safeNext() ?? "/");
  }, [loading, user, submitting, router]);

  useEffect(() => {
    if (!isSignup) return;
    const id = step === 0 ? "name" : "password";
    if (step === 1 || window.matchMedia("(pointer: fine)").matches) document.getElementById(id)?.focus();
  }, [isSignup, step]);

  useEffect(() => {
    if (formError) alertRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [formError]);

  const errors = useMemo(() => {
    const next: Partial<Record<Field, string>> = {};
    if (isSignup && name.trim().length < 2) next.name = name.trim() ? t.auth.errName : t.auth.errRequired;
    if (!email.trim()) next.email = t.auth.errRequired;
    else if (!EMAIL.test(email.trim())) next.email = t.auth.errEmail;
    if (!password) next.password = t.auth.errRequired;
    else if (isSignup && password.length < 8) next.password = t.auth.errPassword;
    return next;
  }, [isSignup, name, email, password, t]);

  const shown = (f: Field) => (touched[f] || submitted ? errors[f] : undefined);
  const touch = (f: Field) => setTouched((prev) => ({ ...prev, [f]: true }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (isSignup && step === 0) {
      setTouched((prev) => ({ ...prev, name: true, email: true }));
      if (!errors.name && !errors.email) setStep(1);
      return;
    }

    setSubmitted(true);
    if (isSignup ? errors.password : Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      if (isSignup) await signup(name.trim(), email.trim(), password);
      else await login(email.trim(), password);
      router.replace(safeNext() ?? "/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) setFormError({ text: t.auth.errNetwork });
      else if (err instanceof ApiError && err.status === 503) setFormError({ text: t.auth.errDatabase });
      else if (err instanceof ApiError && err.status === 429) setFormError({ text: t.auth.errTooMany });
      else if (err instanceof ApiError && err.status === 409) {
        setFormError({ text: err.message });
        setStep(0);
      } else setFormError({ text: err instanceof ApiError ? err.message : t.auth.errNetwork });
      setSubmitting(false);
    }
  };

  const nextParam = search;
  const switchHref = `${isSignup ? "/login" : "/signup"}${nextParam}`;

  return (
    <AuthLayout>
      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        {isSignup ? t.auth.signupTitle : t.auth.loginTitle}
      </h1>
      <p className="mt-1 text-[15px] text-muted">
        {isSignup ? (step === 0 ? t.auth.stepDetailsSub : t.auth.stepPasswordSub) : t.auth.loginSub}
      </p>

      {isSignup && (
        <div className="mt-4">
          <Stepper
            steps={[t.auth.stepDetails, t.auth.stepPasswordLabel]}
            current={step}
            label={t.auth.stepOf.replace("{n}", String(step + 1)).replace("{m}", "2")}
          />
        </div>
      )}

      <form onSubmit={submit} noValidate className="mt-5 space-y-3.5">
        {formError && (
          <div ref={alertRef} role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm leading-5 text-red-800">
            {formError.text}{" "}
            {formError.admin && (
              <Link href="/admin/login" className="font-semibold underline">
                {t.auth.adminLink}
              </Link>
            )}
          </div>
        )}

        {isSignup && step === 0 && (
          <div>
            <label htmlFor="name" className="text-sm font-semibold">
              {t.auth.name}
            </label>
            <input
              id="name"
              name="name"
              ref={firstRef}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => touch("name")}
              aria-invalid={!!shown("name")}
              aria-describedby={shown("name") ? "name-error" : undefined}
              className={`${fieldClass} mt-1 ${shown("name") ? "border-red-500" : "border-ink/20"}`}
            />
            {shown("name") && (
              <p id="name-error" className="mt-1 text-[13px] text-red-700">
                {shown("name")}
              </p>
            )}
          </div>
        )}

        {(!isSignup || step === 0) && (
        <div>
          <label htmlFor="email" className="text-sm font-semibold">
            {t.auth.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            ref={isSignup ? undefined : firstRef}
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => touch("email")}
            aria-invalid={!!shown("email")}
            aria-describedby={shown("email") ? "email-error" : undefined}
            className={`${fieldClass} mt-1 ${shown("email") ? "border-red-500" : "border-ink/20"}`}
          />
          {shown("email") && (
            <p id="email-error" className="mt-1 text-[13px] text-red-700">
              {shown("email")}
            </p>
          )}
        </div>
        )}

        {isSignup && step === 1 && (
          <div className="flex items-center justify-between gap-3 rounded-lg bg-tint px-3.5 py-2 text-sm">
            <span className="min-w-0 truncate">
              <span className="font-medium">{name.trim()}</span>
              <span className="text-muted"> · {email.trim()}</span>
            </span>
            <button type="button" onClick={() => setStep(0)} className="shrink-0 font-semibold text-brand hover:underline">
              {t.auth.change}
            </button>
          </div>
        )}

        {(!isSignup || step === 1) && (
        <PasswordField
          id="password"
          label={t.auth.password}
          value={password}
          onChange={setPassword}
          onBlur={() => touch("password")}
          error={shown("password")}
          autoComplete={isSignup ? "new-password" : "current-password"}
          hint={isSignup ? t.auth.passwordHint : undefined}
          showStrength={isSignup}
        />
        )}

        <div className={isSignup && step === 1 ? "grid grid-cols-[auto_1fr] gap-2" : ""}>
          {isSignup && step === 1 && (
            <button
              type="button"
              onClick={() => setStep(0)}
              disabled={submitting}
              className="rounded-lg border border-ink/25 px-4 py-3 text-[15px] font-medium transition-colors hover:border-brand hover:text-brand disabled:opacity-60"
            >
              {t.auth.previous}
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-70"
          >
            {submitting ? (
              <>
                <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                {t.auth.working}
              </>
            ) : (
              <>
                {isSignup ? (step === 0 ? t.auth.next : t.auth.signupSubmit) : t.auth.loginSubmit}
                <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {isSignup && step === 1 && <p className="mt-3 text-xs leading-4 text-muted">{t.auth.terms}</p>}

      <p className="mt-4 border-t border-line pt-4 text-center text-sm text-muted">
        {isSignup ? t.auth.signupSwitchText : t.auth.loginSwitchText}{" "}
        <Link href={switchHref} className="font-semibold text-brand hover:underline">
          {isSignup ? t.auth.signupSwitchLink : t.auth.loginSwitchLink}
        </Link>
      </p>

    </AuthLayout>
  );
}
