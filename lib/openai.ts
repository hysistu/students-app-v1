export type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const DEFAULT_MODEL = "gpt-4o-mini";

export class OpenAIRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "OpenAIRequestError";
    this.status = status;
  }
}

export function openaiSettings() {
  const apiKey = process.env.OPENAI_API_KEY?.trim() ?? "";
  const model = process.env.OPENAI_MODEL?.trim() || DEFAULT_MODEL;
  if (!apiKey) return null;
  return { apiKey, model };
}

export async function askOpenAI(messages: ChatMessage[]) {
  const settings = openaiSettings();
  if (!settings) {
    throw new OpenAIRequestError(
      "OpenAI is not configured. Add OPENAI_API_KEY to .env, then restart the app.",
      503,
    );
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: settings.model,
      messages,
      temperature: 0.7,
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    error?: { message?: string };
    choices?: Array<{ message?: { content?: string } }>;
  } | null;

  if (!response.ok) {
    const detail = payload?.error?.message || `OpenAI request failed (${response.status}).`;
    throw new OpenAIRequestError(detail, response.status);
  }

  const reply = payload?.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    throw new OpenAIRequestError("OpenAI returned an empty reply.", 502);
  }

  return reply;
}
