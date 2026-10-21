"use client";

import Link from "next/link";
import { useState } from "react";
import { GraduationCap, Menu, X } from "lucide-react";
import { useAuth } from "@/components/auth";

export default function SiteHeader() {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const workspace = user?.role === "student" ? "/courses" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
            <GraduationCap size={18} />
          </span>
          TechLab
        </Link>

        <nav className="hidden items-center gap-1 sm:flex">
          <Link
            href="/#products"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Shop
          </Link>
          <Link
            href="/contact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Contact
          </Link>
          <Link
            href="/ai"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            AI
          </Link>
          <Link
            href="/assignments"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Tasks
          </Link>
          {!loading && user ? (
            <Link href={workspace} className="btn btn-primary ml-2 !py-2">
              Open workspace
            </Link>
          ) : (
            <Link href="/login" className="btn btn-primary ml-2 !py-2">
              Sign in
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 sm:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/#products"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Shop
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Contact
            </Link>
            <Link
              href="/ai"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              AI
            </Link>
            <Link
              href="/assignments"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Tasks
            </Link>
            {!loading && user ? (
              <Link
                href={workspace}
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-2"
              >
                Open workspace
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="btn btn-primary mt-2"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
