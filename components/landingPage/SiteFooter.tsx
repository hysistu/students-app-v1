import Link from "next/link";
import { GraduationCap } from "lucide-react";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2.5 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
            <GraduationCap size={16} />
          </span>
          TechLab
        </div>
        <p className="text-sm text-slate-500">
          Student shop, courses, and workspace.
        </p>
        <div className="flex gap-4 text-sm font-medium text-slate-600">
          <Link href="/#products" className="hover:text-slate-900">
            Shop
          </Link>
          <Link href="/contact" className="hover:text-slate-900">
            Contact
          </Link>
          <Link href="/ai" className="hover:text-slate-900">
            AI
          </Link>
          <Link href="/assignments" className="hover:text-slate-900">
            Tasks
          </Link>
          <Link href="/login" className="hover:text-slate-900">
            Sign in
          </Link>
        </div>
      </div>
    </footer>
  );
}
