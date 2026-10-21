import type { Metadata } from "next";
import { groups, rules } from "@/lib/tasks";

export const metadata: Metadata = {
  title: "Detyrat Frontend · TechLab",
  description: "Detyrat në grup për lëndën Frontend",
};

const accounts = [
  ["Student", "student@example.com"],
  ["Instructor", "instructor@example.com"],
  ["Admin", "admin@example.com"],
];

export default function TasksPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Lënda Frontend
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
          Detyrat
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Backend-i ka endpoint-e të reja që ende nuk kanë UI. Detyra juaj është
          të ndërtoni frontend-in për to në këtë aplikacion Next.js. Gjeni
          grupin tuaj më poshtë.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Grupet">
          {groups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="btn btn-light">
              {g.name} · {g.theme}
            </a>
          ))}
        </nav>
      </header>

      <section className="card mb-10 p-6">
        <h2 className="text-xl font-bold text-slate-900">
          Rregullat për të gjithë
        </h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
          {rules.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <h3 className="mt-6 text-sm font-semibold text-slate-900">
          Si të filloni
        </h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
          <li>
            Te students-api ekzekutoni <b>npm run seed:demo</b> pastaj{" "}
            <b>npm run dev</b>. Te students-app ekzekutoni <b>npm run dev</b>.
          </li>
          <li>
            Provoni çdo endpoint në curl ose Postman para se të shkruani UI.
            README i ka të gjitha të listuara.
          </li>
          <li>
            Demo accounts përdorin password-in <b>ChangeMe123!</b> (admin përdor
            ADMIN_PASSWORD nga .env):
          </li>
        </ol>
        <ul className="mt-2 flex flex-wrap gap-2 pl-5 text-xs">
          {accounts.map(([role, email]) => (
            <li
              key={role}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700"
            >
              {role}: <b>{email}</b>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-slate-600">
          Review-t punojnë vetëm për student që është enrolled në kurs. Shtoni
          një kurs në cart dhe bëni checkout më parë.
        </p>
      </section>

      <div className="space-y-12">
        {groups.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-6">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl font-bold text-slate-900">
                {g.name}: {g.theme}
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {g.members} {g.members === 1 ? "student" : "studentë"}
              </span>
            </div>
            <p className="mb-5 text-slate-600">{g.brief}</p>

            <div className="grid gap-4">
              {g.tasks.map((t, i) => (
                <article key={t.title} className="card p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {t.title}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {t.owner}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{t.summary}</p>

                  <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Endpoints
                  </h4>
                  <ul className="mt-1.5 space-y-1">
                    {t.endpoints.map((e) => (
                      <li key={e} className="overflow-x-auto">
                        <code className="whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-slate-100">
                          {e}
                        </code>
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Requirements
                  </h4>
                  <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                    {t.requirements.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-5">
              <h4 className="text-sm font-semibold text-slate-900">
                Bonus, vetëm kur të keni mbaruar detyrat më sipër
              </h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {g.stretch.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
