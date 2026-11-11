import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Fraunces, Inter, Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import Shell from "@/components/Shell";
import { AuthProvider } from "@/lib/auth";
import { LangProvider } from "@/lib/lang";
import "./globals.css";

const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sansDeva = Noto_Sans_Devanagari({
  variable: "--font-noto-sans-deva",
  subsets: ["devanagari"],
});

const serif = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
});

const serifDeva = Noto_Serif_Devanagari({
  variable: "--font-noto-serif-deva",
  subsets: ["devanagari"],
});

export const metadata: Metadata = {
  title: "SetuAI",
  description: "Your bridge to Indian government services and schemes",
};

export const viewport: Viewport = {
  themeColor: "#faf8f4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sans.variable} ${sansDeva.variable} ${serif.variable} ${serifDeva.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col bg-paper font-sans text-ink">
        <LangProvider>
          <AuthProvider>
            <Suspense fallback={<div className="min-h-dvh bg-paper" />}>
              <Shell>{children}</Shell>
            </Suspense>
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  );
}
