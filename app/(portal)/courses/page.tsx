"use client";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  Plus,
  BookOpen,
  Users,
  ArrowUpRight,
  ShoppingCart,
} from "lucide-react";
import { useAuth } from "@/components/auth";
import { useCart } from "@/components/cart-context";
import {
  Badge,
  ConfirmButton,
  Empty,
  Modal,
  Notice,
  PageHeader,
  Pagination,
  SearchField,
} from "@/components/ui";
import { api, money, query } from "@/lib/api";
import type { Cart, Course, PageResult, Status, User } from "@/lib/types";
const blank = {
  title: "",
  description: "",
  imageUrl: "",
  price: "0",
  instructorId: "",
  status: "active" as Status,
};
export default function CoursesPage() {
  const { refreshCart } = useCart();
  const { user: viewer } = useAuth();
  const [data, setData] = useState<PageResult<Course> | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState<Course | "new" | null>(null);
  const [form, setForm] = useState(blank);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!viewer) return;
    let current = true;
    api<PageResult<Course>>(`/courses${query({ page, search, status })}`)
      .then((result) => {
        if (current) {
          setData(result);
          setError("");
        }
      })
      .catch((e) => {
        if (current) setError(e.message);
      });
    return () => {
      current = false;
    };
  }, [viewer, page, search, status, version]);
  async function open(item: Course | "new") {
    setEditing(item);
    setError("");
    setForm(
      item === "new"
        ? blank
        : {
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            price: String(item.price),
            instructorId: item.instructor?.id || "",
            status: item.status,
          },
    );
    try {
      const result = await api<PageResult<User>>(
        "/users?role=instructor&limit=50",
      );
      setInstructors(result.items);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api(
        `/courses${editing === "new" ? "" : `/${(editing as Course).id}`}`,
        {
          method: editing === "new" ? "POST" : "PATCH",
          body: JSON.stringify({ ...form, price: Number(form.price) }),
        },
      );
      setEditing(null);
      setVersion((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) {
    try {
      await api(`/courses/${id}`, { method: "DELETE" });
      setVersion((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function add(id: string) {
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      const result = await api<Cart>("/cart/items", {
        method: "POST",
        body: JSON.stringify({ courseId: id }),
      });
      setSuccess(
        `Course added to cart. ${result.count} item${result.count === 1 ? "" : "s"} in cart.`,
      );
      await refreshCart();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeader
        title={viewer?.role === "student" ? "Explore courses" : "Courses"}
        description={
          viewer?.role === "student"
            ? "Find your next course and add it to your cart."
            : "Manage your course catalog and enrollments."
        }
        action={
          viewer?.role === "admin" && (
            <button
              className="btn btn-primary"
              onClick={() => void open("new")}
            >
              <Plus size={17} /> Add course
            </button>
          )
        }
      />
      {error && !editing && (
        <Notice message={error} onClose={() => setError("")} />
      )}{" "}
      {success && (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          {success}{" "}
          <Link className="font-bold underline" href="/cart">
            View cart
          </Link>
        </div>
      )}
      <div className="mb-6 grid gap-3 md:grid-cols-[1fr_180px]">
        <SearchField
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search courses"
        />
        {viewer?.role !== "student" && (
          <select
            className="field"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        )}
      </div>
      {data?.items.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {data.items.map((course) => (
            <article className="card overflow-hidden" key={course.id}>
              <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#dce9ff] to-[#b9d0fa]">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen size={50} className="text-blue-500" />
                )}
              </div>
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <Badge value={course.status} />
                  <span className="text-lg font-bold">
                    {money(course.price)}
                  </span>
                </div>
                <h2 className="line-clamp-1 text-lg font-bold">
                  {course.title}
                </h2>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm text-slate-500">
                  {course.description}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500">
                  <span>{course.instructor?.name}</span>
                  <span className="flex items-center gap-1">
                    <Users size={15} />
                    {course.enrollmentCount}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/courses/${course.id}`}
                    className="btn btn-light flex-1"
                  >
                    Details <ArrowUpRight size={15} />
                  </Link>
                  {viewer?.role === "student" && (
                    <button
                      className="btn btn-primary"
                      disabled={busy}
                      onClick={() => void add(course.id)}
                      aria-label={`Add ${course.title} to cart`}
                    >
                      <ShoppingCart size={17} />
                    </button>
                  )}
                  {viewer?.role === "admin" && (
                    <>
                      <button
                        className="text-sm font-semibold text-blue-600"
                        onClick={() => void open(course)}
                      >
                        Edit
                      </button>
                      <ConfirmButton onConfirm={() => void remove(course.id)} />
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : data ? (
        <Empty
          title={
            viewer?.role === "student"
              ? "No available courses"
              : "No courses found"
          }
          description={
            viewer?.role === "student"
              ? "No unenrolled courses match your search. Your enrolled courses are in My courses."
              : "Create a course or change your filters."
          }
        />
      ) : (
        <p className="text-sm text-slate-500">Loading courses…</p>
      )}
      {data && <Pagination {...data.pagination} onChange={setPage} />}{" "}
      {editing && (
        <Modal
          title={editing === "new" ? "Create course" : "Edit course"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="space-y-4">
            {error && <Notice message={error} />}
            <div>
              <label className="label">Course title</label>
              <input
                className="field"
                required
                minLength={2}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea
                className="field"
                required
                minLength={5}
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Image URL</label>
              <input
                className="field"
                type="url"
                placeholder="https://…"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Price (EUR)</label>
                <input
                  className="field"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  className="field"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value as Status })
                  }
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Instructor</label>
              <select
                className="field"
                required
                value={form.instructorId}
                onChange={(e) =>
                  setForm({ ...form, instructorId: e.target.value })
                }
              >
                <option value="">Select instructor</option>
                {instructors.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button disabled={busy} className="btn btn-primary">
                {busy ? "Saving…" : "Save course"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
