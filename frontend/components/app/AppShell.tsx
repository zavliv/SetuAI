"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useChats } from "@/lib/chats";
import { useLang } from "@/lib/lang";
import { MenuIcon, PlusIcon, SidebarIcon } from "../icons";
import Sidebar from "./Sidebar";

const COLLAPSE_KEY = "setuai-sidebar-collapsed";

const titles: Record<string, "services" | "schemes"> = { "/services": "services", "/schemes": "schemes" };

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useLang();
  const { chats, activeId, messages, newChat } = useChats();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {}
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, prev ? "0" : "1");
      } catch {}
      return !prev;
    });
  };

  const onChat = pathname === "/" || pathname === "/chat";
  const section = titles[pathname];
  const title = onChat
    ? (activeId && chats.find((c) => c.id === activeId)?.title) || "SetuAI"
    : section
      ? t.nav[section]
      : pathname.startsWith("/services/")
        ? t.nav.services
        : pathname.startsWith("/admin")
          ? t.app.admin
          : "SetuAI";

  const startNew = () => {
    newChat();
    if (!onChat) router.push("/");
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-paper print:block print:h-auto print:overflow-visible">
      <Sidebar open={open} collapsed={collapsed} onClose={() => setOpen(false)} onCollapse={toggleCollapsed} />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-3 print:hidden sm:px-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={t.app.openMenu}
            className="rounded-md p-2 text-ink hover:bg-tint lg:hidden"
          >
            <MenuIcon />
          </button>
          {collapsed && (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={t.app.showSidebar}
              title={t.app.showSidebar}
              className="hidden rounded-md p-2 text-muted hover:bg-tint hover:text-ink lg:block"
            >
              <SidebarIcon />
            </button>
          )}
          <div className="min-w-0 flex-1 truncate font-serif text-lg font-semibold">{title}</div>
          {onChat && messages.length > 0 && (
            <button
              type="button"
              onClick={startNew}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink/25 px-3 py-1.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
            >
              <PlusIcon />
              <span className="hidden sm:inline">{t.chat.newChat}</span>
            </button>
          )}
        </header>

        <main id="main" className="flex min-h-0 flex-1 flex-col overflow-y-auto print:block print:overflow-visible">
          {children}
        </main>
      </div>
    </div>
  );
}
