"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, Send, Sparkles, User } from "lucide-react";
import AiMessageContent from "@/components/ai/AiMessageContent";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const starters = [
  "How do I call the products API from Next.js?",
  "What can a seller do in TechLab?",
  "Explain the cart and checkout flow briefly.",
];

export default function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  async function send(content: string) {
    const text = content.trim();
    if (!text || busy) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const result = (await response.json().catch(() => null)) as
        | { reply?: string; error?: string }
        | null;
      if (!response.ok) {
        throw new Error(result?.error || "Could not get an AI reply.");
      }
      if (!result?.reply) {
        throw new Error("Could not get an AI reply.");
      }
      setMessages([...nextMessages, { role: "assistant", content: result.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not get an AI reply.");
      setMessages(nextMessages);
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <div className="card flex min-h-[32rem] flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 to-white px-4 py-3.5 sm:px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/25">
          <Sparkles size={16} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">TechLab Assistant</p>
          <p className="text-xs text-slate-500">OpenAI · frontend-only route</p>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto bg-[#f8fafc] px-4 py-5 sm:px-5">
        {messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-5">
            <p className="text-sm leading-relaxed text-slate-600">
              Ask about courses, products, roles, or how this Next.js app talks to
              the API.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {starters.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-left text-xs font-medium text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
                  onClick={() => void send(prompt)}
                  disabled={busy}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message, index) => {
          const isUser = message.role === "user";
          return (
            <div
              key={`${message.role}-${index}`}
              className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  isUser
                    ? "bg-blue-600 text-white"
                    : "border border-slate-200 bg-white text-blue-600 shadow-sm"
                }`}
                aria-hidden
              >
                {isUser ? <User size={15} /> : <Bot size={15} />}
              </span>
              <div
                className={`max-w-[min(100%,36rem)] rounded-2xl px-4 py-3 shadow-sm ${
                  isUser
                    ? "rounded-tr-md bg-blue-600 text-sm leading-relaxed text-white"
                    : "rounded-tl-md border border-slate-200/80 bg-white"
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <AiMessageContent content={message.content} />
                )}
              </div>
            </div>
          );
        })}

        {busy && (
          <div className="flex gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-sm">
              <Bot size={15} />
            </span>
            <div className="inline-flex items-center gap-2 rounded-2xl rounded-tl-md border border-slate-200/80 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
              <LoaderCircle size={16} className="animate-spin text-blue-600" />
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-100 bg-white p-4 sm:px-5">
        {error && (
          <p role="alert" className="mb-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        <form onSubmit={submit} className="flex gap-2">
          <input
            className="field flex-1"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask TechLab Assistant…"
            maxLength={2000}
            disabled={busy}
            aria-label="Message"
          />
          <button
            type="submit"
            className="btn btn-primary !px-3"
            disabled={busy || !input.trim()}
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
