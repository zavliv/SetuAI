import type { Metadata } from "next";
import AdminLogin from "@/components/auth/AdminLogin";

export const metadata: Metadata = { title: "Admin sign in | SetuAI", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return <AdminLogin />;
}
