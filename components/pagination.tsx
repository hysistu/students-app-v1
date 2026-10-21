"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  /** `pagination.page` from the API (1-based). */
  currentPage: number;
  /** `pagination.limit` from the API. */
  limit: number;
  /** `pagination.total` from the API. */
  total: number;
  onPageChange: (page: number) => void;
  className?: string;
};

// 1 … 4 5 [6] 7 8 … 20
function pageList(current: number, last: number): (number | "…")[] {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
  const pages = new Set([1, last, current - 1, current, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (current >= last - 2)
    [last - 3, last - 2, last - 1].forEach((p) => pages.add(p));
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

const base =
  "inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors";

const Pagination = ({
  currentPage,
  limit,
  total,
  onPageChange,
  className = "",
}: PaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(1, limit)));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  if (total === 0 || totalPages === 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const go = (p: number) => {
    if (p !== page && p >= 1 && p <= totalPages) onPageChange(p);
  };

  return (
    <nav
      aria-label="Pagination"
      className={`mt-10 flex flex-col items-center gap-3 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => go(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className={`${base} border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50`}
        >
          <ChevronLeft size={16} />
        </button>
        {pageList(page, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`gap-${i}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => go(p)}
              aria-current={p === page ? "page" : undefined}
              className={`${base} ${
                p === page
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => go(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className={`${base} border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <p className="text-sm text-slate-500">
        Showing {from}–{to} of {total}
      </p>
    </nav>
  );
};

export default Pagination;
