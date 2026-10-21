import type { Metadata } from "next";
import Link from "next/link";
import AiChat from "@/components/ai/AiChat";
import SiteFooter from "@/components/landingPage/SiteFooter";
import SiteHeader from "@/components/landingPage/SiteHeader";

export const metadata: Metadata = {
  title: "AI Assistant · TechLab",
  description: "Chat with TechLab Assistant powered by OpenAI from the Next.js frontend",
};

export default function AiPage() {
  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-900">
      <SiteHeader />
      <main className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            OpenAI
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            TechLab Assistant
          </h1>
          <p className="mt-4 max-w-md text-slate-600">
            Ask questions about the shop, courses, roles, and how this frontend
            talks to the API. The browser calls a Next.js route; that route uses
            your <code>OPENAI_API_KEY</code> on the server.
          </p>
          <p className="mt-4 text-sm text-slate-500">
            How it works:{" "}
            <Link href="/ai-guide" className="font-medium text-blue-600 hover:underline">
              AI integration guide
            </Link>
          </p>
        </div>
        <AiChat />
      </main>
      <SiteFooter />
    </div>
  );
}
