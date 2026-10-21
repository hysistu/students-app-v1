"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, LockKeyhole, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth";
export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await login(email, password);
      router.replace(user.role === "student" ? "/courses" : "/dashboard");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-[#112b53] p-12 text-white lg:flex">
        <div className="flex items-center gap-3 text-xl font-bold">
          <div className="rounded-xl bg-blue-500 p-2">
            <GraduationCap size={24} />
          </div>
          TechLab
        </div>
        <div>
          <div className="mb-5 inline-block rounded-full border border-white/20 px-4 py-2 text-sm text-blue-100">
            Student & Course Management
          </div>
          <h1 className="max-w-lg text-5xl font-bold leading-tight">
            Your learning space at TechLab.
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-blue-100">
            Manage people, organize courses, and turn course discovery into
            enrollment.
          </p>
        </div>
        <p className="text-sm text-blue-200">
          Built for learning React, Next.js, APIs and MongoDB.
        </p>
      </section>
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 flex items-center gap-3 text-xl font-bold text-slate-800 lg:hidden">
            <GraduationCap className="text-blue-600" />
            TechLab
          </div>
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <LockKeyhole />
          </div>
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-slate-500">
            Sign in to your TechLab workspace.
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                className="field"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                className="field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button disabled={busy} className="btn btn-primary w-full">
              {busy ? "Signing in…" : "Sign in"}
              <ArrowRight size={16} />
            </button>
          </form>
          <p className="mt-8 text-sm text-slate-400">
            Ask your administrator for an account.
          </p>
        </div>
      </section>
    </main>
  );
}
