import type { Metadata } from "next";
import { ChatSwitch } from "@/components/HomeSwitch";

export const metadata: Metadata = { title: "Ask SetuAI | SetuAI" };

export default function ChatPage() {
  return <ChatSwitch />;
}
