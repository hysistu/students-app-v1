import { sendContactEmail } from "@/lib/mail";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send a name, email, and message." }, { status: 400 });
  }

  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const name = text(record.name, 80);
  const email = text(record.email, 120);
  const message = text(record.message, 2000);

  if (!name || !email || !message) {
    return Response.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  if (!emailPattern.test(email)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  try {
    await sendContactEmail({ name, email, message });
  } catch (error) {
    const detail = error instanceof Error ? error.message : "Could not send your message.";
    const status = detail.startsWith("Mail is not configured") ? 503 : 502;
    console.error("Contact form failed:", detail);
    return Response.json(
      { error: status === 503 ? detail : "Could not send your message. Try again." },
      { status },
    );
  }

  return Response.json({ ok: true });
}
