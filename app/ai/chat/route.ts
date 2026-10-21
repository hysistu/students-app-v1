import { askOpenAI, OpenAIRequestError, type ChatMessage } from "@/lib/openai";

const SYSTEM_PROMPT = `You are TechLab Assistant, a helpful tutor for a student shop and course management app built with Next.js and an Express API.
Always reply in English only. Never reply in another language. Only if the user's message is clearly written in a non-English language, ask once to switch to English — then answer their question in English. If they already wrote in English, answer immediately; never ask them to "continue in English."
Stay strictly on TechLab: the student shop and course management app (Next.js frontend, Express API), roles (admin, instructor, student, seller), products, courses, cart, auth, and how to use or build those features.
If the question is outside TechLab (general knowledge, unrelated people/topics, other products, etc.), reply with exactly this message and nothing else: Do not ask me things outside the TechLab
Do not expand, apologize, or continue the off-topic conversation after that refusal.
Keep on-topic answers short and practical. Prefer step-by-step guidance.
Format for easy reading: short paragraphs, markdown headings when useful, bullet or numbered lists for steps, and inline code with backticks for paths, commands, and API routes. Use fenced code blocks only for multi-line snippets.

Client and reputation rules (strict):
- Never write, draft, or help with negative, harsh, or one-star reviews of TechLab, its courses, products, instructors, sellers, or clients.
- Do not insult, belittle, or publicly criticize clients, students, instructors, sellers, or staff.
- If asked for a bad review, roast, complaint script, or damaging feedback, refuse briefly and offer constructive alternatives (how to get support, report a bug, or suggest improvements politely).
- When discussing issues, stay factual and solution-focused; frame problems as fixable steps, not as attacks on people or the product.`;

const MAX_MESSAGES = 20;
const MAX_CONTENT = 2000;

function text(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function parseMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value)) return null;
  if (value.length === 0 || value.length > MAX_MESSAGES) return null;

  const messages: ChatMessage[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") return null;
    const record = item as Record<string, unknown>;
    const role = record.role;
    const content = text(record.content, MAX_CONTENT);
    if ((role !== "user" && role !== "assistant") || !content) return null;
    messages.push({ role, content });
  }
  return messages;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a JSON body with messages." }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const messages = parseMessages(record.messages);
  if (!messages) {
    return Response.json(
      {
        error: `Send up to ${MAX_MESSAGES} messages with role "user" or "assistant" and non-empty content.`,
      },
      { status: 400 },
    );
  }

  try {
    const reply = await askOpenAI([{ role: "system", content: SYSTEM_PROMPT }, ...messages]);
    return Response.json({ reply });
  } catch (error) {
    if (error instanceof OpenAIRequestError) {
      console.error("AI chat failed:", error.message);
      // Pass through config / billing / auth messages; hide opaque upstream 5xx noise.
      const clientIssue = error.status === 503 || (error.status >= 400 && error.status < 500);
      return Response.json(
        { error: clientIssue ? error.message : "Could not get an AI reply. Try again." },
        { status: clientIssue ? error.status : 502 },
      );
    }
    const detail = error instanceof Error ? error.message : "Could not get an AI reply.";
    console.error("AI chat failed:", detail);
    return Response.json({ error: "Could not get an AI reply. Try again." }, { status: 502 });
  }
}
