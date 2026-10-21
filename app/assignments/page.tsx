import type { Metadata } from "next";
import Link from "next/link";
import { groups, rules } from "@/lib/assignments";

export const metadata: Metadata = {
  title: "New tasks · TechLab",
  description: "Frontend tasks for the seller dashboard, product access, and the double network request",
};

const accounts = [
  ["Student", "student@example.com"],
  ["Instructor", "instructor@example.com"],
  ["Seller", "seller@example.com"],
  ["Admin", "admin@example.com"],
];

export default function AssignmentsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Frontend course
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
          New tasks
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Three groups. Group A builds the seller dashboard. Group B makes
          sure other roles cannot open Manage Products. One student
          investigates why the Network panel requests the same endpoint twice.
          This page is public. You do not need to sign in to read it.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Groups">
          {groups.map((group) => (
            <a key={group.id} href={`#${group.id}`} className="btn btn-light">
              {group.name} · {group.theme}
            </a>
          ))}
        </nav>
      </header>

      <section className="card mb-10 p-6">
        <h2 className="text-xl font-bold text-slate-900">Rules for everyone</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
          {rules.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ul>
        <h3 className="mt-6 text-sm font-semibold text-slate-900">How to start</h3>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
          <li>
            In students-api run <b>npm run seed:demo</b>, then <b>npm run dev</b>.
            In students-app run <b>npm run dev</b>.
          </li>
          <li>
            The earlier task list is still at <Link href="/tasks">/tasks</Link>.
            These tasks are new. Do not redo that list.
          </li>
          <li>
            Demo accounts use the password <b>ChangeMe123!</b>. Admin uses
            ADMIN_PASSWORD from the API <b>.env</b>.
          </li>
        </ol>
        <ul className="mt-3 flex flex-wrap gap-2 text-xs">
          {accounts.map(([role, email]) => (
            <li
              key={role}
              className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700"
            >
              {role}: <b>{email}</b>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-12">
        {groups.map((group) => (
          <section key={group.id} id={group.id} className="scroll-mt-6">
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl font-bold text-slate-900">
                {group.name}: {group.theme}
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {group.members} {group.members === 1 ? "student" : "students"}
              </span>
            </div>
            <p className="mb-5 text-slate-600">{group.brief}</p>

            <div className="grid gap-4">
              {group.tasks.map((task, index) => (
                <article key={task.title} className="card p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {task.title}
                    </h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      {task.owner}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{task.summary}</p>

                  <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Start here
                  </h4>
                  <ul className="mt-1.5 space-y-1">
                    {task.where.map((item) => (
                      <li key={item} className="overflow-x-auto">
                        <code className="whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-slate-100">
                          {item}
                        </code>
                      </li>
                    ))}
                  </ul>

                  <h4 className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Requirements
                  </h4>
                  <ul className="mt-1.5 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
                    {task.requirements.map((requirement) => (
                      <li key={requirement}>{requirement}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 p-5">
              <h4 className="text-sm font-semibold text-slate-900">
                Bonus, only after the tasks above are done
              </h4>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {group.stretch.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
