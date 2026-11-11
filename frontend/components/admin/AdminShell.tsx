"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import { Loading } from "./ui";

const items = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/services", label: "Services" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <Loading />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-semibold">Admin access only</h1>
        <p className="mt-3 text-muted">
          {user ? "Your account does not have admin access." : "Sign in with an admin account to continue."}
        </p>
        <Link
          href="/admin/login"
          className="mt-6 inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
        >
          Admin sign in
        </Link>
      </div>
    );
  }

  const isActive = (href: string, exact?: boolean) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <nav aria-label="Admin sections" className="mb-8 flex gap-1 overflow-x-auto border-b border-line">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive(item.href, item.exact) ? "page" : undefined}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive(item.href, item.exact) ? "border-brand text-brand" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
