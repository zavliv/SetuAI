"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { api, ApiError } from "./api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  created_at: string;
};

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  adminLogin: (email: string, password: string) => Promise<User>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const HINT_KEY = "setuai-session";

function setHint(on: boolean) {
  try {
    if (on) localStorage.setItem(HINT_KEY, "1");
    else localStorage.removeItem(HINT_KEY);
  } catch {}
}

const subscribeHint = () => () => {};
const readHint = () => {
  try {
    return localStorage.getItem(HINT_KEY) === "1";
  } catch {
    return false;
  }
};

export function useSessionHint() {
  return useSyncExternalStore(subscribeHint, readHint, () => false);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api<User>("/api/auth/me")
      .then((u) => {
        if (!active) return;
        setUser(u);
        setHint(true);
      })
      .catch((e) => {
        if (!active) return;
        if (e instanceof ApiError && e.status === 401) setHint(false);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await api<User>("/api/auth/login", { method: "POST", body: { email, password } });
    setHint(true);
    setUser(u);
    return u;
  }, []);

  const adminLogin = useCallback(async (email: string, password: string) => {
    const u = await api<User>("/api/auth/admin/login", { method: "POST", body: { email, password } });
    setHint(true);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const u = await api<User>("/api/auth/signup", { method: "POST", body: { name, email, password } });
    setHint(true);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(async () => {
    await api("/api/auth/logout", { method: "POST" }).catch(() => {});
    setHint(false);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, login, adminLogin, signup, logout }), [user, loading, login, adminLogin, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
