"use client";
import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        size={17}
      />
      <input
        className="field pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
export function Badge({ value }: { value: string }) {
  const styles =
    value === "active"
      ? "bg-emerald-50 text-emerald-700"
      : value === "inactive"
        ? "bg-slate-100 text-slate-500"
        : value === "admin"
          ? "bg-violet-50 text-violet-700"
          : value === "instructor"
            ? "bg-amber-50 text-amber-700"
            : "bg-blue-50 text-blue-700";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}
    >
      {value}
    </span>
  );
}
export function Notice({
  message,
  onClose,
}: {
  message: string;
  onClose?: () => void;
}) {
  return (
    <div
      role="alert"
      className="mb-5 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {message}
      {onClose && (
        <button onClick={onClose} aria-label="Dismiss">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
export function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="card p-12 text-center">
      <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-slate-100 p-3 text-slate-400">
        <Search />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Pagination({
  page,
  pages,
  total,
  onChange,
}: {
  page: number;
  pages: number;
  total: number;
  onChange: (page: number) => void;
}) {
  if (total === 0) return null;
  return (
    <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
      <span>
        {total} result{total === 1 ? "" : "s"} · Page {page} of{" "}
        {Math.max(1, pages)}
      </span>
      <div className="flex gap-2">
        <button
          className="btn btn-light !p-2"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={17} />
        </button>
        <button
          className="btn btn-light !p-2"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={17} />
        </button>
      </div>
    </div>
  );
}
export function ConfirmButton({
  label = "Delete",
  onConfirm,
}: {
  label?: string;
  onConfirm: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="text-sm font-semibold text-red-600 hover:text-red-800"
        onClick={() => setOpen(true)}
      >
        {label}
      </button>
      {open && (
        <Modal title="Confirm deletion" onClose={() => setOpen(false)}>
          <p className="mb-6 text-sm text-slate-600">
            This action removes the record and its related data. Continue?
          </p>
          <div className="flex justify-end gap-2">
            <button className="btn btn-light" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
