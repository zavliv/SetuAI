"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAuth, useSessionHint } from "@/lib/auth";
import { ChatsProvider } from "@/lib/chats";
import AppShell from "./app/AppShell";
import Footer from "./Footer";
import Header from "./Header";
import LogoMark from "./Logo";

const PUBLIC_PATHS = ["/", "/login", "/signup", "/admin/login"];
const STANDALONE_PATHS = ["/login", "/signup", "/admin/login"];

function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center bg-paper">
      <LogoMark className="size-14 animate-pulse" />
    </div>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const hint = useSessionHint();

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const standalone = STANDALONE_PATHS.includes(pathname);
  const mustLogin = !loading && !user && !isPublic;

  useEffect(() => {
    if (!mustLogin) return;
    const next = `${window.location.pathname}${window.location.search}`;
    const target = pathname.startsWith("/admin") ? "/admin/login" : "/login";
    router.replace(`${target}?next=${encodeURIComponent(next)}`);
  }, [mustLogin, pathname, router]);

  if ((loading && (hint || !isPublic)) || mustLogin) return <Splash />;

  if (standalone) return <>{children}</>;

  if (user) {
    return (
      <ChatsProvider>
        <AppShell>{children}</AppShell>
      </ChatsProvider>
    );
  }

  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
