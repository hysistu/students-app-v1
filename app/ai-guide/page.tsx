import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Udhëzuesi AI · TechLab",
  description:
    "Dokumentim hap pas hapi: si integrohet OpenAI në frontend të students-app",
};

const toc = [
  { id: "qellimi", label: "Qëllimi" },
  { id: "arkitektura", label: "Arkitektura" },
  { id: "hap-1", label: "Hapi 1 · Env" },
  { id: "hap-2", label: "Hapi 2 · lib/openai" },
  { id: "hap-3", label: "Hapi 3 · Route Handler" },
  { id: "hap-4", label: "Hapi 4 · Chat UI" },
  { id: "hap-5", label: "Hapi 5 · Faqja /ai" },
  { id: "hap-6", label: "Hapi 6 · Testimi" },
  { id: "request", label: "Request / response" },
  { id: "gabimet", label: "Gabimet" },
  { id: "files", label: "Files" },
];

const envBlock = `# students-app/.env  (ose .env.local)

API_ORIGIN=http://localhost:4000

# OpenAI — vetëm në server, JO NEXT_PUBLIC_
OPENAI_API_KEY=sk-...
# Opsionale. Default: gpt-4o-mini
OPENAI_MODEL=gpt-4o-mini`;

const openaiHelper = `// lib/openai.ts (ideja)
export function openaiSettings() {
  const apiKey = process.env.OPENAI_API_KEY?.trim() ?? "";
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  if (!apiKey) return null;
  return { apiKey, model };
}

export async function askOpenAI(messages) {
  const settings = openaiSettings();
  if (!settings) throw new Error("OpenAI is not configured…");

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: \`Bearer \${settings.apiKey}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: settings.model,
        messages,
        temperature: 0.7,
      }),
    },
  );
  // lexo choices[0].message.content
}`;

const routeHandler = `// app/ai/chat/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  // 1) valido messages (role, content, limite)
  // 2) shto system prompt për TechLab
  // 3) thirr askOpenAI([...])
  // 4) kthe { reply } ose { error }
}`;

const clientFetch = `// components/ai/AiChat.tsx (fragment)
const response = await fetch("/ai/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: nextMessages }),
});
const result = await response.json();
if (!response.ok) throw new Error(result.error);
// shto { role: "assistant", content: result.reply } te state`;

const requestShape = `// Browser → POST /ai/chat
{
  "messages": [
    { "role": "user", "content": "Çfarë bën një seller?" },
    { "role": "assistant", "content": "…" },
    { "role": "user", "content": "Po admin?" }
  ]
}

// Rregulla:
// - max 20 messages
// - çdo content max 2000 chars
// - role vetëm "user" | "assistant"
//   (system prompt shtohet në server)

// Sukses → 200
{ "reply": "teksti i OpenAI…" }

// Body i keq → 400
{ "error": "Send up to 20 messages…" }

// Mungon OPENAI_API_KEY → 503
{ "error": "OpenAI is not configured. …" }

// Billing / auth nga OpenAI → 4xx
{ "error": "You have no credits remaining. …" }

// Dështim i paqartë upstream → 502
{ "error": "Could not get an AI reply. Try again." }`;

const flow = [
  ["1", "Përdoruesi", "Shkruan mesazhin në /ai"],
  ["2", "AiChat (client)", "POST /ai/chat me historikun e messages"],
  ["3", "Route Handler", "Validon body + shton system prompt"],
  ["4", "lib/openai.ts", "Thërret OpenAI Chat Completions me key nga env"],
  ["5", "OpenAI", "Kthen choices[0].message.content"],
  ["6", "UI", "Shfaq reply me markdown (lista, kod, paragrafë)"],
];

const files = [
  ["app/ai/page.tsx", "Faqja publike e chat-it (layout + metadata)"],
  ["components/ai/AiChat.tsx", "Client component: state, fetch, loading, error"],
  ["components/ai/AiMessageContent.tsx", "Render i reply me markdown të lehtë"],
  ["app/ai/chat/route.ts", "Route Handler: validate → OpenAI → JSON"],
  ["lib/openai.ts", "Lexon OPENAI_* dhe thërret Chat Completions"],
  [".env / .env.example", "OPENAI_API_KEY dhe OPENAI_MODEL"],
];

const mistakes = [
  {
    bad: "NEXT_PUBLIC_OPENAI_API_KEY në client",
    good: "OPENAI_API_KEY vetëm në server (Route Handler / lib)",
  },
  {
    bad: "Thirrje direkte nga browser te api.openai.com",
    good: "Browser → /ai/chat → OpenAI",
  },
  {
    bad: "Path nën /api/* (p.sh. /api/ai/chat)",
    good: "Përdor /ai/chat — next.config e rishkruan /api/* te students-api",
  },
  {
    bad: "Ndryshon .env dhe nuk rinison dev server",
    good: "Pas çdo ndryshimi env: ndalo dhe nis përsëri npm run dev",
  },
  {
    bad: "Ndryshime në students-api për AI",
    good: "AI është 100% në students-app; API Express nuk preket",
  },
];

function Code({ children }: { children: string }) {
  return (
    <pre className="card overflow-x-auto p-4 text-xs leading-relaxed text-slate-800">
      {children}
    </pre>
  );
}

export default function AiGuidePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Dokumentim frontend
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
          Si integrohet AI në frontend
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Udhëzues hap pas hapi për TechLab Assistant me OpenAI. Gjithçka
          ndodh në <b>students-app</b> (Next.js).{" "}
          <b>students-api</b> nuk ndryshohet. API key nuk del kurrë në
          browser.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/ai" className="btn btn-primary">
            Hap assistant-in
          </Link>
          <a href="#hap-1" className="btn btn-light">
            Fillo nga hapi 1
          </a>
        </div>
      </header>

      <nav
        className="card mb-10 p-5"
        aria-label="Përmbajtja e dokumentimit"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Përmbajtja
        </h2>
        <ol className="mt-3 grid gap-1.5 text-sm text-slate-700 sm:grid-cols-2">
          {toc.map((item, index) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="inline-flex gap-2 rounded-lg px-2 py-1 hover:bg-slate-50 hover:text-blue-700"
              >
                <span className="font-mono text-xs text-slate-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <section id="qellimi" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">Qëllimi</h2>
        <div className="card space-y-3 p-5 text-sm leading-relaxed text-slate-700">
          <p>
            Të shtosh një chat AI në aplikacionin Next.js pa backend Express
            të ri. Browser-i flet me një{" "}
            <b>Route Handler</b> lokal; ai Route Handler flet me OpenAI duke
            përdorur <code>OPENAI_API_KEY</code> nga env.
          </p>
          <p>
            Pattern i njëjtë me contact form (<code>/contact/send</code> +{" "}
            <code>GMAIL_*</code>): secret-et jetojnë vetëm në serverin e
            Next.js.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>
              <b>Po:</b> chat UI, Route Handler, env, formatim i reply
            </li>
            <li>
              <b>Jo:</b> endpoint i ri në students-api,{" "}
              <code>NEXT_PUBLIC_</code> për API key
            </li>
          </ul>
        </div>
      </section>

      <section id="arkitektura" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">Arkitektura</h2>
        <p className="mb-3 text-sm text-slate-600">
          Rrjedha e një mesazhi nga UI deri te OpenAI dhe mbrapsht:
        </p>
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Ku</th>
                <th className="px-4 py-2">Çfarë ndodh</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {flow.map(([n, where, what]) => (
                <tr key={n} className="border-t border-slate-100">
                  <td className="px-4 py-2 font-mono text-xs text-slate-400">
                    {n}
                  </td>
                  <td className="px-4 py-2 font-semibold">{where}</td>
                  <td className="px-4 py-2">{what}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Path-i <code>/ai/chat</code> <b>nuk</b> është nën{" "}
          <code>/api/*</code>. Në këtë projekt,{" "}
          <code>next.config</code> i rishkruan kërkesat{" "}
          <code>/api/*</code> te Express. Prandaj AI qëndron jashtë atij
          prefix-i, njësoj si <code>/contact/send</code>.
        </p>
      </section>

      <section id="hap-1" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Hapi 1 — Konfiguro env
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <div className="card space-y-2 p-5">
            <ol className="list-decimal space-y-2 pl-5">
              <li>
                Hap{" "}
                <a
                  href="https://platform.openai.com/api-keys"
                  className="font-medium text-blue-600 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  platform.openai.com/api-keys
                </a>{" "}
                dhe krijo një API key.
              </li>
              <li>
                Sigurohu që account ka credits (billing). Pa credits, OpenAI
                kthen gabim edhe nëse key është i saktë.
              </li>
              <li>
                Në folderin <code>students-app</code>, shto në{" "}
                <code>.env</code> (ose <code>.env.local</code>):
              </li>
            </ol>
          </div>
          <Code>{envBlock}</Code>
          <div className="card space-y-2 p-5">
            <p>
              <b>E rëndësishme:</b> mos e prefikso me{" "}
              <code>NEXT_PUBLIC_</code>. Çdo variable me atë prefix bundlohet
              në JavaScript të browser-it dhe key-ja bëhet publike.
            </p>
            <p>
              Pas ruajtjes së env: ndalo <code>npm run dev</code> dhe nise
              përsëri. Next.js lexon env në start.
            </p>
          </div>
        </div>
      </section>

      <section id="hap-2" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Hapi 2 — Helper-i <code>lib/openai.ts</code>
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <div className="card space-y-2 p-5">
            <p>
              Ky file është i vetmi vend që njeh OpenAI HTTP API. Ai:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Lexon <code>OPENAI_API_KEY</code> dhe{" "}
                <code>OPENAI_MODEL</code> nga <code>process.env</code>
              </li>
              <li>
                Bën <code>POST</code> te{" "}
                <code>https://api.openai.com/v1/chat/completions</code>
              </li>
              <li>
                Kthen tekstin e reply, ose hedh{" "}
                <code>OpenAIRequestError</code> me status + mesazh
              </li>
            </ul>
            <p>
              Nuk ka SDK të detyrueshëm: përdoret <code>fetch</code> i
              Node/Next, për të mbajtur dependency-t e lehta.
            </p>
          </div>
          <Code>{openaiHelper}</Code>
        </div>
      </section>

      <section id="hap-3" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Hapi 3 — Route Handler <code>app/ai/chat/route.ts</code>
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <div className="card space-y-2 p-5">
            <p>
              File-i <code>route.ts</code> krijon endpoint-in publik{" "}
              <code>POST /ai/chat</code>. Ai nuk ekspozon key-n; vetëm
              pranon JSON nga UI dhe kthen JSON.
            </p>
            <p>Përgjegjësitë e tij:</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>
                Lexon <code>request.json()</code> — nëse nuk është JSON →{" "}
                <code>400</code>
              </li>
              <li>
                Validon <code>messages</code>: array, max 20, çdo element me{" "}
                <code>role</code> <code>user|assistant</code> dhe{" "}
                <code>content</code> jo bosh (max 2000 chars)
              </li>
              <li>
                Shton <b>system prompt</b> për TechLab (ton, format markdown,
                kontekst kursi/shop)
              </li>
              <li>
                Thërret <code>askOpenAI([...])</code>
              </li>
              <li>
                Kthen <code>{`{ reply }`}</code> ose{" "}
                <code>{`{ error }`}</code> me status të përshtatshëm
              </li>
            </ol>
          </div>
          <Code>{routeHandler}</Code>
          <div className="card p-5">
            <p>
              <b>Pse system prompt në server?</b> Që klienti të mos e
              ndryshojë lehtë “personalitetin” e assistant-it. UI dërgon
              vetëm historikun user/assistant.
            </p>
          </div>
        </div>
      </section>

      <section id="hap-4" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Hapi 4 — Chat UI (<code>AiChat</code>)
        </h2>
        <div className="space-y-3 text-sm leading-relaxed text-slate-700">
          <div className="card space-y-2 p-5">
            <p>
              <code>components/ai/AiChat.tsx</code> është{" "}
              <code>&quot;use client&quot;</code>. Mban state për:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <code>messages</code> — lista user / assistant
              </li>
              <li>
                <code>input</code>, <code>busy</code>, <code>error</code>
              </li>
            </ul>
            <p>Kur dërgon një mesazh:</p>
            <ol className="list-decimal space-y-1.5 pl-5">
              <li>Shton mesazhin e user në listë</li>
              <li>
                Bën <code>fetch(&quot;/ai/chat&quot;)</code> me të gjithë
                historikun (që OpenAI të ketë kontekst)
              </li>
              <li>
                Në sukses shton <code>assistant</code> me{" "}
                <code>result.reply</code>
              </li>
              <li>
                Në gabim shfaq <code>error</code> (p.sh. credits / config)
              </li>
            </ol>
            <p>
              Reply e assistant-it kalon në{" "}
              <code>AiMessageContent</code>: paragrafë, lista,{" "}
              <code>inline code</code>, blloqe kodi — më e lehtë për syrin.
            </p>
          </div>
          <Code>{clientFetch}</Code>
        </div>
      </section>

      <section id="hap-5" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Hapi 5 — Faqja publike <code>/ai</code>
        </h2>
        <div className="card space-y-2 p-5 text-sm leading-relaxed text-slate-700">
          <p>
            <code>app/ai/page.tsx</code> është Server Component që vendos
            metadata, <code>SiteHeader</code>, tekst shpjegues dhe monton{" "}
            <code>AiChat</code>. Linku te ky udhëzues është{" "}
            <code>/ai-guide</code>.
          </p>
          <p>
            Nuk ka auth të detyrueshëm: faqja është publike (si contact).
            Nëse do ta mbrosh më vonë, shto path-in në{" "}
            <code>proxy.ts</code> matcher — por sot AI është i hapur për
            demo.
          </p>
          <p>
            Linku “AI” në header/footer të çon te <code>/ai</code>.
          </p>
        </div>
      </section>

      <section id="hap-6" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Hapi 6 — Testimi hap pas hapi
        </h2>
        <div className="card p-5 text-sm text-slate-700">
          <ol className="list-decimal space-y-2.5 pl-5">
            <li>
              Nis <code>npm run dev</code> në <code>students-app</code>{" "}
              (pas env).
            </li>
            <li>
              Hap <code>http://localhost:3000/ai</code>.
            </li>
            <li>
              Hap DevTools → Network. Dërgo një pyetje. Duhet të shohësh{" "}
              <code>POST /ai/chat</code> (jo një request drejt{" "}
              <code>api.openai.com</code> nga browser).
            </li>
            <li>
              Status <code>200</code> + JSON me <code>reply</code> → OK.
            </li>
            <li>
              Hiq përkohësisht key-n nga env, rinis serverin, provo përsëri →
              duhet <code>503</code> me mesazh konfigurimi.
            </li>
            <li>
              Nëse OpenAI thotë “no credits”, shto billing — kjo nuk është
              bug i kodit.
            </li>
          </ol>
        </div>
      </section>

      <section id="request" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Request dhe response
        </h2>
        <Code>{requestShape}</Code>
      </section>

      <section id="gabimet" className="mb-10 scroll-mt-6">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Gabime të zakonshme
        </h2>
        <div className="space-y-3">
          {mistakes.map((item) => (
            <div key={item.bad} className="card p-4 text-sm">
              <p className="text-red-700">
                <span className="font-semibold">Mos bëj:</span> {item.bad}
              </p>
              <p className="mt-1 text-emerald-700">
                <span className="font-semibold">Bëj:</span> {item.good}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="files" className="card scroll-mt-6 p-6">
        <h2 className="text-xl font-bold text-slate-900">Files në projekt</h2>
        <p className="mt-1 text-sm text-slate-600">
          Harta e skedarëve që përbëjnë integrimin AI:
        </p>
        <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
          {files.map(([path, note]) => (
            <li key={path} className="border-t border-slate-100 pt-2.5 first:border-0 first:pt-0">
              <code className="font-semibold text-slate-900">{path}</code>
              <span className="text-slate-500"> — {note}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-slate-600">
          Provo chat-in:{" "}
          <Link href="/ai" className="font-medium text-blue-600 hover:underline">
            /ai
          </Link>
        </p>
      </section>
    </main>
  );
}
