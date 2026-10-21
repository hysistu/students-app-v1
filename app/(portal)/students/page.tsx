"use client";
import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAuth } from "@/components/auth";
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
import { api, query } from "@/lib/api";
import type {
  Course,
  Enrollment,
  PageResult,
  Status,
  Student,
  User,
} from "@/lib/types";
export default function StudentsPage() {
  const { user: viewer } = useAuth();
  const [data, setData] = useState<PageResult<Student> | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [version, setVersion] = useState(0);
  const [editing, setEditing] = useState<Student | "new" | null>(null);
  const [detail, setDetail] = useState<{
    student: Student;
    enrollments: Enrollment[];
  } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [accountMode, setAccountMode] = useState("new");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    userId: "",
    studentNumber: "",
    notes: "",
    status: "active" as Status,
  });
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!viewer || viewer.role === "student") return;
    let current = true;
    api<PageResult<Student>>(`/students${query({ page, search, status })}`)
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
  async function open(item: Student | "new") {
    setEditing(item);
    setError("");
    setAccountMode("new");
    setForm(
      item === "new"
        ? {
            name: "",
            email: "",
            password: "",
            userId: "",
            studentNumber: "",
            notes: "",
            status: "active",
          }
        : {
            name: item.user.name,
            email: item.user.email,
            password: "",
            userId: item.user.id,
            studentNumber: item.studentNumber,
            notes: item.notes,
            status: item.status,
          },
    );
    if (item === "new") {
      try {
        const result = await api<PageResult<User>>(
          "/users?role=student&limit=50",
        );
        setUsers(result.items);
      } catch (e) {
        setError((e as Error).message);
      }
    }
  }
  async function view(id: string) {
    try {
      setDetail(await api(`/students/${id}`));
      setError("");
      if (viewer?.role === "admin") {
        const result = await api<PageResult<Course>>(
          "/courses?status=active&limit=50",
        );
        setCourses(result.items);
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        studentNumber: form.studentNumber,
        notes: form.notes,
        status: form.status,
        ...(editing === "new" && accountMode === "existing"
          ? { userId: form.userId }
          : {
              name: form.name,
              email: form.email,
              ...(form.password ? { password: form.password } : {}),
            }),
      };
      await api(
        `/students${editing === "new" ? "" : `/${(editing as Student).id}`}`,
        {
          method: editing === "new" ? "POST" : "PATCH",
          body: JSON.stringify(payload),
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
  async function enroll() {
    if (!detail || !courseId) return;
    setBusy(true);
    setError("");
    try {
      await api(`/students/${detail.student.id}/enrollments`, {
        method: "POST",
        body: JSON.stringify({ courseId }),
      });
      await view(detail.student.id);
      setCourseId("");
      setVersion((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(id: string) {
    try {
      await api(`/students/${id}`, { method: "DELETE" });
      setVersion((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (viewer?.role === "student")
    return (
      <Notice message="Only administrators and instructors can view students." />
    );
  return (
    <>
      <PageHeader
        title="Students"
        description="View student profiles and their enrolled courses."
        action={
          viewer?.role === "admin" && (
            <button
              className="btn btn-primary"
              onClick={() => void open("new")}
            >
              <Plus size={17} /> Add student
            </button>
          )
        }
      />
      {error && !editing && !detail && (
        <Notice message={error} onClose={() => setError("")} />
      )}
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_180px]">
        <SearchField
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search student or number"
        />
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
      </div>
      {data?.items.length ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <p className="font-semibold">{item.user?.name}</p>
                    <p className="text-xs text-slate-500">{item.user?.email}</p>
                  </td>
                  <td>{item.studentNumber}</td>
                  <td>
                    <Badge value={item.status} />
                  </td>
                  <td>
                    <div className="flex gap-4">
                      <button
                        className="text-sm font-semibold text-blue-600"
                        onClick={() => void view(item.id)}
                      >
                        Details
                      </button>
                      {viewer?.role === "admin" && (
                        <>
                          <button
                            className="text-sm font-semibold text-blue-600"
                            onClick={() => void open(item)}
                          >
                            Edit
                          </button>
                          <ConfirmButton
                            onConfirm={() => void remove(item.id)}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : data ? (
        <Empty
          title="No students found"
          description="Create a student profile or change your filters."
        />
      ) : (
        <p className="text-sm text-slate-500">Loading students…</p>
      )}
      {data && <Pagination {...data.pagination} onChange={setPage} />}{" "}
      {editing && (
        <Modal
          title={editing === "new" ? "Create student" : "Edit student"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="space-y-4">
            {error && <Notice message={error} />}{" "}
            {editing === "new" && (
              <div>
                <label className="label" htmlFor="student-account-mode">
                  Account
                </label>
                <select
                  id="student-account-mode"
                  className="field"
                  value={accountMode}
                  onChange={(e) => setAccountMode(e.target.value)}
                >
                  <option value="new">Create a new student account</option>
                  <option value="existing">
                    Link an existing student user
                  </option>
                </select>
              </div>
            )}
            {(editing !== "new" || accountMode === "new") && (
              <>
                <div>
                  <label className="label" htmlFor="student-name">
                    Full name
                  </label>
                  <input
                    id="student-name"
                    className="field"
                    required
                    minLength={2}
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Student's full name"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="student-email">
                    Email address
                  </label>
                  <input
                    id="student-email"
                    className="field"
                    required
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        email: e.target.value,
                      }))
                    }
                    placeholder="student@example.com"
                  />
                </div>
                <div>
                  <label className="label" htmlFor="student-password">
                    {editing === "new" ? "Password" : "New password (optional)"}
                  </label>
                  <input
                    id="student-password"
                    className="field"
                    type="password"
                    autoComplete="new-password"
                    required={editing === "new"}
                    minLength={8}
                    value={form.password}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        password: e.target.value,
                      }))
                    }
                    placeholder={
                      editing === "new"
                        ? "At least 8 characters"
                        : "Leave blank to keep current password"
                    }
                  />
                </div>
              </>
            )}
            {editing === "new" && accountMode === "existing" && (
              <div>
                <label className="label" htmlFor="student-user">
                  Student user
                </label>
                <select
                  id="student-user"
                  required
                  className="field"
                  value={form.userId}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      userId: e.target.value,
                    }))
                  }
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · {user.email}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  Select an account that does not already have a student
                  profile.
                </p>
              </div>
            )}
            <div>
              <label className="label" htmlFor="student-number">
                Student number
              </label>
              <input
                id="student-number"
                required
                minLength={2}
                className="field"
                value={form.studentNumber}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    studentNumber: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <label className="label" htmlFor="student-notes">
                Notes
              </label>
              <textarea
                id="student-notes"
                className="field"
                rows={3}
                value={form.notes}
                onChange={(e) =>
                  setForm((current) => ({ ...current, notes: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="label" htmlFor="student-status">
                Status
              </label>
              <select
                id="student-status"
                className="field"
                value={form.status}
                onChange={(e) =>
                  setForm((current) => ({
                    ...current,
                    status: e.target.value as Status,
                  }))
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
                {busy ? "Saving…" : "Save student"}
              </button>
            </div>
          </form>
        </Modal>
      )}
      {detail && (
        <Modal title={detail.student.user.name} onClose={() => setDetail(null)}>
          <p className="text-sm text-slate-500">
            {detail.student.user.email} · {detail.student.studentNumber}
          </p>
          <h3 className="mb-3 mt-6 font-semibold">Enrolled courses</h3>
          {detail.enrollments.length ? (
            <ul className="space-y-2">
              {detail.enrollments.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl bg-slate-50 p-3 text-sm"
                >
                  {item.course?.title || "Deleted course"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">No courses yet.</p>
          )}
          {viewer?.role === "admin" && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <label className="label">Assign to course</label>
              <div className="flex gap-2">
                <select
                  className="field"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-primary"
                  disabled={busy || !courseId}
                  onClick={() => void enroll()}
                >
                  Assign
                </button>
              </div>
            </div>
          )}
          {error && (
            <div className="mt-4">
              <Notice message={error} />
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
