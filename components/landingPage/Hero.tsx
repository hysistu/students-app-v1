import Link from "next/link";
import { ArrowRight, BookOpen, ShoppingBag, Users } from "lucide-react";

const points = [
  {
    icon: ShoppingBag,
    title: "Student shop",
    text: "Apparel, hardware, and accessories from the TechLab catalogue.",
  },
  {
    icon: BookOpen,
    title: "Courses",
    text: "Sign in to browse courses, enroll, and keep a cart.",
  },
  {
    icon: Users,
    title: "Workspace",
    text: "Admins and instructors manage people, products, and classes.",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(37,99,235,0.16),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(15,23,42,0.08),_transparent_45%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div>
          <p className="inline-flex items-center rounded-full border border-blue-200 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            Student workspace
          </p>
          <h1 className="mt-5 max-w-xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl sm:leading-[1.08]">
            A shop and a classroom in one place.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
            Browse what TechLab has in stock, then sign in to manage courses,
            students, and products.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#products" className="btn btn-primary">
              Browse the shop
              <ArrowRight size={16} />
            </a>
            <Link href="/login" className="btn btn-light">
              Sign in
            </Link>
          </div>
        </div>

        <div className="grid gap-3">
          {points.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className="flex gap-4 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm shadow-slate-200/70 backdrop-blur"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{point.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">
                    {point.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
