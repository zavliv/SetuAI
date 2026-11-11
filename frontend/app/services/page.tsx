import type { Metadata } from "next";
import ServicesView from "@/components/ServicesView";

export const metadata: Metadata = { title: "Services | SetuAI" };

export default function ServicesPage() {
  return <ServicesView />;
}
