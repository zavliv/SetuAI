"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { ShieldIcon } from "../icons";
import LogoMark from "../Logo";
import PasswordField, { fieldClass } from "./PasswordField";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LABELS = { show: "Show password", hide: "Hide password", capsLock: "Caps Lock is on" };

function adminNext(): string {
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/admin") && !next.startsWith("/admin/login") && !next.startsWith("//") ? next : "/admin";
}

export default function AdminLogin() {
  const router = useRouter();
  const { user, loading, adminLogin, logout } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && user?.role === "admin" && !submitting) router.replace(adminNext());
  }, [loading, user, submitting, router]);

  useEffect(() => {
    if (!loading && !user && window.matchMedia("(pointer: fine)").matches) emailRef.current?.focus();
  }, [loading, user]);

  const emailError = submitted ? (!email.trim() ? "Enter your email address." : !EMAIL.test(email.trim()) ? "Enter a valid email address." : "") : "";
  const passwordError = submitted && !password ? "Enter your password." : "";

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitted(true);
    if (!email.trim() || !EMAIL.test(email.trim()) || !password) return;

    setSubmitting(true);
    try {
      await adminLogin(email.trim(), password);
      router.replace(adminNext());
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) setError("Could not reach the server. Please try again.");
      else if (err instanceof ApiError && err.status === 503) setError("The database is not ready. Please try again later.");
      else setError(err instanceof ApiError ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  };

  const blocked = !loading && user && user.role !== "admin";

  return (
    <div className="relative grid min-h-dvh place-items-center overflow-hidden bg-[#12151d] px-4 py-6">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 opacity-[0.07]">
        <svg viewBox="0 0 480 120" className="mx-auto w-full max-w-3xl text-white" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M10 40H470M20 110Q90 10 160 110M160 110Q230 10 300 110M300 110Q370 10 440 110" />
        </svg>
      </div>

      <main id="main" className="relative w-full max-w-md">
        <div className="mb-4 flex items-center justify-center gap-3 text-white">
          <LogoMark className="size-9" />
          <span className="font-serif text-2xl font-semibold tracking-tight">
            Setu<span className="text-[#8fa2e8]">AI</span>
          </span>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-7">
          {loading ? (
            <div className="space-y-3" aria-busy>
              <div className="h-8 w-2/3 animate-pulse rounded-lg bg-line" />
              <div className="h-12 animate-pulse rounded-xl bg-line/70" />
              <div className="h-12 animate-pulse rounded-xl bg-line/70" />
            </div>
          ) : blocked ? (
            <div>
              <span className="grid size-11 place-items-center rounded-full bg-warn-bg text-warn">
                <ShieldIcon className="size-5" />
              </span>
              <h1 className="mt-4 font-serif text-2xl font-semibold">This account is not an admin</h1>
              <p className="mt-2 leading-7 text-muted">
                You are signed in as <span className="font-medium text-ink">{user?.email}</span>. Log out to sign in with an admin account.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-xl bg-ink px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-black"
                >
                  Log out
                </button>
                <Link href="/" className="rounded-xl border border-ink/25 px-5 py-3 text-sm font-medium transition-colors hover:border-brand hover:text-brand">
                  Back to the app
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white">
                  <ShieldIcon className="size-5" />
                </span>
                <div>
                  <h1 className="font-serif text-2xl leading-tight font-semibold tracking-tight">Admin sign in</h1>
                  <p className="text-sm text-muted">Restricted area for administrators.</p>
                </div>
              </div>

              <form onSubmit={submit} noValidate className="mt-5 space-y-3.5">
                {error && (
                  <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm leading-5 text-red-800">
                    {error}
                  </p>
                )}

                <div>
                  <label htmlFor="admin-email" className="text-sm font-semibold">
                    Admin email
                  </label>
                  <input
                    id="admin-email"
                    ref={emailRef}
                    type="email"
                    inputMode="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!emailError}
                    className={`${fieldClass} mt-1 ${emailError ? "border-red-500" : "border-ink/20"}`}
                  />
                  {emailError && <p className="mt-1 text-[13px] text-red-700">{emailError}</p>}
                </div>

                <PasswordField
                  id="admin-password"
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  error={passwordError}
                  autoComplete="current-password"
                  labels={LABELS}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-brand-dark disabled:opacity-70"
                >
                  {submitting && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
                  {submitting ? "Signing in" : "Sign in to admin"}
                </button>
              </form>

              <p className="mt-4 text-xs leading-4 text-muted">Repeated failed attempts lock this sign-in for a few minutes.</p>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-sm">
          <Link href="/" className="text-white/70 transition-colors hover:text-white">
            ← Back to SetuAI
          </Link>
        </p>
      </main>
    </div>
  );
}
