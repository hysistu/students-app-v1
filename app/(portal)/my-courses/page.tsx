"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/components/auth";
import { Empty, Notice, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import type { Enrollment } from "@/lib/types";
export default function MyCoursesPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Enrollment[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (user?.role === "student")
      api<{ items: Enrollment[] }>("/my-courses")
        .then((data) => setItems(data.items))
        .catch((e) => setError(e.message));
  }, [user]);
  if (user?.role !== "student")
    return <Notice message="This page is for students." />;
  return (
    <>
      <PageHeader
        title="My courses"
        description="Courses you have enrolled in."
      />
      {error && <Notice message={error} />}{" "}
      {items === null && !error && (
        <p className="text-sm text-slate-500">Loading your courses…</p>
      )}
      {items?.length === 0 && (
        <Empty
          title="No courses yet"
          description="Browse courses and complete checkout to enroll."
        />
      )}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items?.map(
          (item) =>
            item.course && (
              <Link
                href={`/courses/${item.course.id}`}
                key={item.id}
                className="card overflow-hidden hover:border-blue-300"
              >
                <div className="flex h-40 items-center justify-center bg-blue-100">
                  {item.course.imageUrl ? (
                    <img
                      src={item.course.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen size={48} className="text-blue-500" />
                  )}
                </div>
                <div className="p-5">
                  <p className="mb-2 text-xs font-semibold uppercase text-emerald-700">
                    Enrolled
                  </p>
                  <h2 className="text-lg font-bold">{item.course.title}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {item.course.instructor?.name}
                  </p>
                  <span className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">
                    View course <ArrowUpRight size={15} />
                  </span>
                </div>
              </Link>
            ),
        )}
      </div>
    </>
  );
}
