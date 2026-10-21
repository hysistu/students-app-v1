"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  LibraryBig,
  ShoppingCart,
  ArrowUpRight,
} from "lucide-react";
import { useAuth } from "@/components/auth";
import { PageHeader, Notice, Badge } from "@/components/ui";
import { api } from "@/lib/api";
import type { Student, Course } from "@/lib/types";
type Stats = {
  users: number;
  students: number;
  courses: number;
  activeCourses: number;
  enrollments: number;
  carts: number;
  recentStudents: Student[];
  recentCourses: Course[];
};
export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (user?.role === "admin")
      api<Stats>("/dashboard")
        .then(setData)
        .catch((e) => setError(e.message));
  }, [user]);
  if (user?.role === "instructor")
    return (
      <>
        <PageHeader
          title={`Welcome back, ${user.name.split(" ")[0]}`}
          description="Your teaching workspace at a glance."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Link href="/courses" className="card p-7 hover:border-blue-300">
            <BookOpen className="mb-4 text-blue-600" />
            <h2 className="text-xl font-bold">Assigned courses</h2>
            <p className="mt-2 text-sm text-slate-500">
              View your courses and the students enrolled in each one.
            </p>
            <ArrowUpRight className="mt-5 text-blue-600" />
          </Link>
          <Link href="/students" className="card p-7 hover:border-blue-300">
            <GraduationCap className="mb-4 text-blue-600" />
            <h2 className="text-xl font-bold">Your students</h2>
            <p className="mt-2 text-sm text-slate-500">
              See student profiles for your courses.
            </p>
            <ArrowUpRight className="mt-5 text-blue-600" />
          </Link>
        </div>
      </>
    );
  const cards = data
    ? [
        { label: "Total users", value: data.users, icon: Users },
        { label: "Students", value: data.students, icon: GraduationCap },
        { label: "Courses", value: data.courses, icon: BookOpen },
        { label: "Active courses", value: data.activeCourses, icon: BookOpen },
        { label: "Enrollments", value: data.enrollments, icon: LibraryBig },
        { label: "Active carts", value: data.carts, icon: ShoppingCart },
      ]
    : [];
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of your TechLab activity."
        action={
          <Link href="/courses" className="btn btn-primary">
            Manage courses <ArrowUpRight size={16} />
          </Link>
        }
      />
      {error && <Notice message={error} />}{" "}
      {!data && !error && (
        <p className="text-sm text-slate-500">Loading dashboard…</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card p-6">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={21} />
              </div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-1 text-3xl font-bold">{card.value}</p>
            </div>
          );
        })}
      </div>
      {data && (
        <div className="mt-8 grid gap-5 xl:grid-cols-2">
          <section className="card p-6">
            <div className="mb-5 flex justify-between">
              <h2 className="font-bold">Recent students</h2>
              <Link
                href="/students"
                className="text-sm font-semibold text-blue-600"
              >
                View all
              </Link>
            </div>
            {data.recentStudents.length ? (
              data.recentStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between border-t border-slate-100 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{student.user?.name}</p>
                    <p className="text-slate-500">{student.studentNumber}</p>
                  </div>
                  <Badge value={student.status} />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No students yet.</p>
            )}
          </section>
          <section className="card p-6">
            <div className="mb-5 flex justify-between">
              <h2 className="font-bold">Recent courses</h2>
              <Link
                href="/courses"
                className="text-sm font-semibold text-blue-600"
              >
                View all
              </Link>
            </div>
            {data.recentCourses.length ? (
              data.recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between border-t border-slate-100 py-3 text-sm"
                >
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-slate-500">{course.instructor?.name}</p>
                  </div>
                  <Badge value={course.status} />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No courses yet.</p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
