"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/lib/auth";
import { type ChatSummary, useChats } from "@/lib/chats";
import { useLang } from "@/lib/lang";
import {
  ChevronUpIcon,
  CloseIcon,
  CompassIcon,
  GridIcon,
  PlusIcon,
  SearchIcon,
  ShieldIcon,
  SidebarIcon,
  TrashIcon,
} from "../icons";
import LogoMark, { Wordmark } from "../Logo";

type Props = { open: boolean; collapsed: boolean; onClose: () => void; onCollapse: () => void };

function groupChats(chats: ChatSummary[], labels: { today: string; yesterday: string; week: string; older: string }) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const day = 24 * 60 * 60 * 1000;
  const groups: { label: string; items: ChatSummary[] }[] = [
    { label: labels.today, items: [] },
    { label: labels.yesterday, items: [] },
    { label: labels.week, items: [] },
    { label: labels.older, items: [] },
  ];
  for (const chat of chats) {
    const age = startOfToday.getTime() - new Date(chat.updated_at).getTime();
    if (age <= 0) groups[0].items.push(chat);
    else if (age <= day) groups[1].items.push(chat);
    else if (age <= 7 * day) groups[2].items.push(chat);
    else groups[3].items.push(chat);
  }
  return groups.filter((g) => g.items.length > 0);
}

export default function Sidebar({ open, collapsed, onClose, onCollapse }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, lang, setLang } = useLang();
  const { user, logout } = useAuth();
  const { chats, chatsLoading, activeId, newChat, openChat, deleteChat } = useChats();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? chats.filter((c) => c.title.toLowerCase().includes(q)) : chats;
  }, [chats, query]);

  const groups = useMemo(() => groupChats(filtered, t.app), [filtered, t.app]);

  const onChat = pathname === "/" || pathname === "/chat";

  const goNew = () => {
    newChat();
    if (!onChat) router.push("/");
    onClose();
  };

  const goChat = (id: string) => {
    openChat(id);
    if (!onChat) router.push("/");
    onClose();
  };

  const confirmDelete = (chat: ChatSummary) => {
    if (window.confirm(`${t.app.deleteConfirm}\n\n${chat.title}`)) deleteChat(chat.id);
  };

  const navItems = [
    { href: "/services", label: t.nav.services, icon: <GridIcon /> },
    { href: "/schemes", label: t.nav.schemes, icon: <CompassIcon /> },
    ...(user?.role === "admin" ? [{ href: "/admin", label: t.app.admin, icon: <ShieldIcon /> }] : []),
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={onClose} aria-hidden />}

      <aside
        aria-label="Sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex w-[min(18rem,88vw)] flex-col border-r border-line bg-side transition-transform duration-200 print:hidden lg:static lg:z-auto lg:w-72 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:hidden" : ""}`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between px-4">
          <Link href="/" onClick={goNew} className="flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <Wordmark />
          </Link>
          <button
            type="button"
            onClick={onCollapse}
            aria-label={t.app.hideSidebar}
            title={t.app.hideSidebar}
            className="hidden rounded-md p-2 text-muted hover:bg-white hover:text-ink lg:block"
          >
            <SidebarIcon />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.app.closeMenu}
            className="rounded-md p-2 text-muted hover:bg-white hover:text-ink lg:hidden"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4 px-3">
          <button
            type="button"
            onClick={goNew}
            className="flex w-full items-center gap-2 rounded-xl bg-brand px-3.5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          >
            <PlusIcon />
            {t.chat.newChat}
          </button>

          <nav aria-label={t.app.tools} className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href) ? "bg-white text-brand shadow-sm" : "text-ink hover:bg-white/70"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col px-3">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15">
            <SearchIcon className="size-4 shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.app.searchChats}
              aria-label={t.app.searchChats}
              className="w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted"
            />
          </div>

          <div className="mt-3 min-h-0 flex-1 overflow-y-auto pb-3">
            {chatsLoading && chats.length === 0 && (
              <div className="space-y-2 px-1" aria-busy>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded-lg bg-line/70" />
                ))}
              </div>
            )}

            {!chatsLoading && chats.length === 0 && <p className="px-2 py-3 text-sm leading-6 text-muted">{t.app.noChats}</p>}
            {chats.length > 0 && filtered.length === 0 && <p className="px-2 py-3 text-sm text-muted">{t.app.noMatch}</p>}

            {groups.map((group) => (
              <section key={group.label} className="mb-3">
                <h2 className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-muted">{group.label}</h2>
                <ul>
                  {group.items.map((chat) => {
                    const active = chat.id === activeId && onChat;
                    return (
                      <li key={chat.id} className="group relative">
                        <button
                          type="button"
                          onClick={() => goChat(chat.id)}
                          aria-current={active ? "true" : undefined}
                          className={`w-full truncate rounded-lg py-2 pr-9 pl-3 text-left text-sm transition-colors ${
                            active ? "bg-white font-medium shadow-sm" : "hover:bg-white/70"
                          }`}
                        >
                          {chat.title}
                        </button>
                        <button
                          type="button"
                          onClick={() => confirmDelete(chat)}
                          aria-label={`${t.app.deleteChat}: ${chat.title}`}
                          title={t.app.deleteChat}
                          className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-md p-1.5 text-muted hover:bg-line hover:text-red-700 focus:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                          <TrashIcon className="size-3.5" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <div ref={menuRef} className="relative shrink-0 border-t border-line p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.app.language}</span>
            <div role="group" aria-label={t.app.language} className="flex overflow-hidden rounded-md border border-line bg-white text-xs">
              {(["en", "hi"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  aria-pressed={lang === code}
                  onClick={() => setLang(code)}
                  className={`px-2.5 py-1 font-medium transition-colors ${lang === code ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
                >
                  {code === "en" ? "EN" : "हिं"}
                </button>
              ))}
            </div>
          </div>

          {menuOpen && (
            <div role="menu" className="absolute right-3 bottom-[calc(100%-0.25rem)] left-3 z-10 rounded-xl border border-line bg-white p-2 shadow-lg">
              <div className="border-b border-line px-3 py-2">
                <p className="text-xs text-muted">{t.auth.signedInAs}</p>
                <p className="truncate text-sm text-muted">{user?.email}</p>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="mt-1 block w-full rounded-md px-3 py-2 text-left text-sm hover:bg-tint"
              >
                {t.auth.logout}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand font-serif text-base font-semibold text-white">
              {user?.name.trim().charAt(0).toUpperCase() || "?"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{user?.name}</span>
              <span className="block truncate text-xs text-muted">{user?.role === "admin" ? t.app.admin : user?.email}</span>
            </span>
            <ChevronUpIcon className="size-4 shrink-0 text-muted" />
          </button>
        </div>
      </aside>
    </>
  );
}
