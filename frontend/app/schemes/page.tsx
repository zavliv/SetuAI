import type { Metadata } from "next";
import SchemeFinder from "@/components/SchemeFinder";

export const metadata: Metadata = { title: "Find schemes | SetuAI" };

export default function SchemesPage() {
  return <SchemeFinder />;
}
