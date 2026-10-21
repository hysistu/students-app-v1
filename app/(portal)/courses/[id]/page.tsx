"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, ShoppingCart, Users } from "lucide-react";
import { useAuth } from "@/components/auth";
import { useCart } from "@/components/cart-context";
import { Badge, Notice } from "@/components/ui";
import { api, money } from "@/lib/api";
import type { Course, Enrollment } from "@/lib/types";
export default function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const { refreshCart } = useCart();
  const { user } = useAuth();
  const [data, setData] = useState<{
    course: Course;
    enrollments: Enrollment[];
  } | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    api<{ course: Course; enrollments: Enrollment[] }>(`/courses/${id}`)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [id]);
  async function add() {
    setBusy(true);
    try {
      await api("/cart/items", {
        method: "POST",
        body: JSON.stringify({ courseId: id }),
      });
      setMessage("Course added to cart.");
      await refreshCart();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Link
        href="/courses"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-600"
      >
        <ArrowLeft size={16} /> Back to courses
      </Link>
      {error && <Notice message={error} />}{" "}
      {!data && !error && (
        <p className="text-sm text-slate-500">Loading course…</p>
      )}
      {data && (
        <div className="grid gap-7 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#dce9ff] to-[#b9d0fa]">
              {data.course.imageUrl ? (
                <img
                  src={data.course.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <BookOpen size={80} className="text-blue-500" />
              )}
            </div>
            <div className="mt-7 flex items-center gap-3">
              <Badge value={data.course.status} />
              <span className="flex items-center gap-1 text-sm text-slate-500">
                <Users size={16} />
                {data.enrollments.length ||
                  data.course.enrollmentCount ||
                  0}{" "}
                students
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-bold">{data.course.title}</h1>
            <p className="mt-5 whitespace-pre-wrap leading-relaxed text-slate-600">
              {data.course.description}
            </p>
            {user?.role !== "student" && (
              <section className="card mt-8 p-6">
                <h2 className="mb-4 text-lg font-bold">Enrolled students</h2>
                {data.enrollments.length ? (
                  data.enrollments.map((item) => (
                    <div
                      className="border-t border-slate-100 py-3 text-sm"
                      key={item.id}
                    >
                      <p className="font-semibold">{item.student?.name}</p>
                      <p className="text-slate-500">{item.student?.email}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No enrollments yet.</p>
                )}
              </section>
            )}
          </div>
          <aside className="card h-fit p-6">
            <p className="text-sm text-slate-500">Course price</p>
            <p className="mt-1 text-3xl font-bold">
              {money(data.course.price)}
            </p>
            <div className="my-5 border-t border-slate-100" />
            <p className="text-sm text-slate-500">Instructor</p>
            <p className="mt-1 font-semibold">{data.course.instructor?.name}</p>
            {user?.role === "student" && data.course.isEnrolled && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-emerald-700">
                  You are enrolled in this course.
                </p>
                <Link className="btn btn-light mt-3 w-full" href="/my-courses">
                  View my courses
                </Link>
              </div>
            )}
            {user?.role === "student" && !data.course.isEnrolled && (
              <>
                <button
                  className="btn btn-primary mt-6 w-full"
                  disabled={busy}
                  onClick={() => void add()}
                >
                  <ShoppingCart size={17} /> Add to cart
                </button>
                {message && (
                  <p className="mt-3 text-sm text-emerald-700">
                    {message}{" "}
                    <Link href="/cart" className="font-bold underline">
                      View cart
                    </Link>
                  </p>
                )}
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
