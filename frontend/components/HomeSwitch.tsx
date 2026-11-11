"use client";

import { useAuth } from "@/lib/auth";
import ChatApp from "./app/ChatApp";
import HomeView from "./HomeView";

export function HomeSwitch() {
  const { user } = useAuth();
  return user ? <ChatApp /> : <HomeView />;
}

export function ChatSwitch() {
  return <ChatApp />;
}
