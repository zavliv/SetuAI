"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { buildAnswer } from "./answer";
import { api } from "./api";
import { useAuth } from "./auth";
import { strings } from "./i18n";
import { useLang } from "./lang";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  serviceId?: string;
};

export type ChatSummary = { id: string; title: string; updated_at: string };

type SavedMessage = { role: "user" | "assistant"; text: string; service_id?: string | null };
type SavedChat = ChatSummary & { messages: SavedMessage[] };

type ChatsContextValue = {
  chats: ChatSummary[];
  chatsLoading: boolean;
  activeId: string | null;
  messages: ChatMessage[];
  isStreaming: boolean;
  opening: boolean;
  saveError: boolean;
  openError: boolean;
  send: (text: string) => Promise<void>;
  stop: () => void;
  newChat: () => void;
  openChat: (id: string) => Promise<void>;
  deleteChat: (id: string) => Promise<void>;
};

const ChatsContext = createContext<ChatsContextValue | null>(null);

let nextId = 0;
const newId = () => `a${++nextId}`;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function toTitle(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 60 ? `${clean.slice(0, 57)}...` : clean;
}

const fromSaved = (m: SavedMessage): ChatMessage => ({
  id: newId(),
  role: m.role,
  text: m.text,
  serviceId: m.service_id ?? undefined,
});

export function ChatsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { lang } = useLang();

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [activeId, setActiveIdState] = useState<string | null>(null);
  const [messages, setMessagesState] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [opening, setOpening] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [openError, setOpenError] = useState(false);

  const messagesRef = useRef<ChatMessage[]>([]);
  const activeRef = useRef<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sessionRef = useRef(0);
  const pendingSave = useRef<Promise<void>>(Promise.resolve());

  const setMessages = (next: ChatMessage[]) => {
    messagesRef.current = next;
    setMessagesState(next);
  };

  const setActive = (id: string | null) => {
    activeRef.current = id;
    setActiveIdState(id);
  };

  useEffect(() => {
    if (!user) return;
    let active = true;
    api<ChatSummary[]>("/api/chats")
      .then((list) => active && setChats(list))
      .catch(() => {})
      .finally(() => active && setChatsLoading(false));
    return () => {
      active = false;
    };
  }, [user]);

  const touch = (saved: ChatSummary) =>
    setChats((prev) => [
      { id: saved.id, title: saved.title, updated_at: saved.updated_at },
      ...prev.filter((c) => c.id !== saved.id),
    ]);

  const persist = (final: ChatMessage[], chatId: string | null, session: number) => {
    const firstQuestion = final.find((m) => m.role === "user");
    if (!firstQuestion) return;
    const body = {
      title: toTitle(firstQuestion.text),
      messages: final
        .filter((m) => m.text)
        .map((m) => ({ role: m.role, text: m.text, service_id: m.serviceId ?? null })),
    };

    const job = (async () => {
      try {
        if (chatId) {
          touch(await api<SavedChat>(`/api/chats/${chatId}`, { method: "PUT", body }));
        } else {
          const saved = await api<SavedChat>("/api/chats", { method: "POST", body });
          touch(saved);
          if (sessionRef.current === session) setActive(saved.id);
        }
        setSaveError(false);
      } catch {
        setSaveError(true);
      }
    })();
    pendingSave.current = job;
  };

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || abortRef.current) return;

      const controller = new AbortController();
      abortRef.current = controller;
      const session = sessionRef.current;

      await pendingSave.current;
      if (sessionRef.current !== session) {
        if (abortRef.current === controller) abortRef.current = null;
        return;
      }

      const chatId = activeRef.current;
      const answer = buildAnswer(question, lang, strings[lang]);
      const replyId = newId();
      const base: ChatMessage[] = [...messagesRef.current, { id: newId(), role: "user", text: question }];
      const reply = (body: string): ChatMessage => ({
        id: replyId,
        role: "assistant",
        text: body,
        serviceId: answer.serviceId,
      });

      setMessages([...base, reply("")]);
      setIsStreaming(true);

      let shown = "";
      if (answer.serviceId) {
        await wait(1100);
        if (!controller.signal.aborted) {
          shown = answer.text;
          if (sessionRef.current === session) setMessages([...base, reply(shown)]);
        }
      } else {
        const pieces = answer.text.match(/\S+\s*/g) ?? [answer.text];
        await wait(700);
        for (let i = 0; i < pieces.length && !controller.signal.aborted; i += 2) {
          shown += pieces.slice(i, i + 2).join("");
          if (sessionRef.current === session) setMessages([...base, reply(shown)]);
          await wait(24);
        }
      }

      if (abortRef.current === controller) abortRef.current = null;
      if (sessionRef.current === session) {
        setIsStreaming(false);
        if (!shown) setMessages(base);
      }
      persist(shown ? [...base, reply(shown)] : base, chatId, session);
    },
    [lang],
  );

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const resetSession = () => {
    sessionRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setOpenError(false);
  };

  const newChat = useCallback(() => {
    resetSession();
    setOpening(false);
    setActive(null);
    setMessages([]);
  }, []);

  const openChat = useCallback(async (id: string) => {
    if (id === activeRef.current && messagesRef.current.length > 0) return;
    resetSession();
    const session = sessionRef.current;
    setOpening(true);
    try {
      await pendingSave.current;
      const chat = await api<SavedChat>(`/api/chats/${id}`);
      if (sessionRef.current !== session) return;
      setActive(chat.id);
      setMessages(chat.messages.map(fromSaved));
    } catch {
      if (sessionRef.current === session) setOpenError(true);
    } finally {
      if (sessionRef.current === session) setOpening(false);
    }
  }, []);

  const deleteChat = useCallback(
    async (id: string) => {
      try {
        await api(`/api/chats/${id}`, { method: "DELETE" });
      } catch {
        return;
      }
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (activeRef.current === id) newChat();
    },
    [newChat],
  );

  const value = useMemo(
    () => ({
      chats,
      chatsLoading,
      activeId,
      messages,
      isStreaming,
      opening,
      saveError,
      openError,
      send,
      stop,
      newChat,
      openChat,
      deleteChat,
    }),
    [chats, chatsLoading, activeId, messages, isStreaming, opening, saveError, openError, send, stop, newChat, openChat, deleteChat],
  );

  return <ChatsContext.Provider value={value}>{children}</ChatsContext.Provider>;
}

export function useChats() {
  const ctx = useContext(ChatsContext);
  if (!ctx) throw new Error("useChats must be used inside ChatsProvider");
  return ctx;
}
