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
import type { PageResult, Role, Status, User } from "@/lib/types";
const blank = {
  name: "",
  email: "",
  password: "",
  role: "student" as Role,
  status: "active" as Status,
  studentNumber: "",
};
export default function UsersPage() {
  const { user: viewer } = useAuth();
  const [data, setData] = useState<PageResult<User> | null>(null);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<User | "new" | null>(null);
  const [form, setForm] = useState(blank);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (viewer?.role !== "admin") return;
    let current = true;
    api<PageResult<User>>(`/users${query({ page, search, role, status })}`)
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
  }, [viewer, page, search, role, status, version]);
  function open(item: User | "new") {
    setEditing(item);
    setError("");
    setForm(
      item === "new"
        ? blank
        : {
            name: item.name,
            email: item.email,
            password: "",
            role: item.role,
            status: item.status,
            studentNumber: "",
          },
    );
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload =
        editing === "new"
          ? { ...form, studentNumber: form.studentNumber || undefined }
          : {
              name: form.name,
              email: form.email,
              role: form.role,
              status: form.status,
              ...(form.password ? { password: form.password } : {}),
            };
      await api(
        `/users${editing === "new" ? "" : `/${(editing as User).id}`}`,
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
  async function remove(id: string) {
    try {
      await api(`/users/${id}`, { method: "DELETE" });
      setVersion((v) => v + 1);
    } catch (e) {
      setError((e as Error).message);
    }
  }
  if (viewer?.role !== "admin")
    return <Notice message="Only administrators can manage users." />;
  return (
    <>
      <PageHeader
        title="Users"
        description="Manage accounts, roles, and access to the platform."
        action={
          <button className="btn btn-primary" onClick={() => open("new")}>
            <Plus size={17} /> Add user
          </button>
        }
      />
      {error && !editing && (
        <Notice message={error} onClose={() => setError("")} />
      )}
      <div className="mb-5 grid gap-3 md:grid-cols-[1fr_160px_160px]">
        <SearchField
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder="Search name or email"
        />
        <select
          className="field"
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="instructor">Instructor</option>
          <option value="seller">Seller</option>
          <option value="student">Student</option>
        </select>
        <select
          className="field"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          aria-label="Filter by status"
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
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">{item.name}</td>
                  <td>{item.email}</td>
                  <td>
                    <Badge value={item.role} />
                  </td>
                  <td>
                    <Badge value={item.status} />
                  </td>
                  <td>
                    <div className="flex gap-4">
                      <button
                        className="text-sm font-semibold text-blue-600"
                        onClick={() => open(item)}
                      >
                        Edit
                      </button>
                      <ConfirmButton onConfirm={() => void remove(item.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : data ? (
        <Empty
          title="No users found"
          description="Create a user or change your filters."
        />
      ) : (
        <p className="text-sm text-slate-500">Loading users…</p>
      )}
      {data && <Pagination {...data.pagination} onChange={setPage} />}{" "}
      {editing && (
        <Modal
          title={editing === "new" ? "Create user" : "Edit user"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="space-y-4">
            {error && <Notice message={error} />}
            <div>
              <label className="label">Full name</label>
              <input
                className="field"
                required
                minLength={2}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input
                className="field"
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="label">
                Password{" "}
                {editing !== "new" && (
                  <span className="font-normal text-slate-400">
                    (leave blank to keep current)
                  </span>
                )}
              </label>
              <input
                className="field"
                type="password"
                minLength={8}
                required={editing === "new"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Role</label>
                <select
                  className="field"
                  value={form.role}
                  onChange={(e) =>
                    setForm({ ...form, role: e.target.value as Role })
                  }
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                </select>
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
            {editing === "new" && form.role === "student" && (
              <div>
                <label className="label">
                  Student number{" "}
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  className="field"
                  value={form.studentNumber}
                  onChange={(e) =>
                    setForm({ ...form, studentNumber: e.target.value })
                  }
                  placeholder="STU-001"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Creates the student profile at the same time.
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button disabled={busy} className="btn btn-primary">
                {busy ? "Saving…" : "Save user"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
