"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, Package, Shirt, Sparkles } from "lucide-react";
import { api, money } from "@/lib/api";
import type { Product } from "@/lib/types";
import { useAuth } from "../auth";

const art: Record<string, { icon: typeof Package; wash: string }> = {
  apparel: {
    icon: Shirt,
    wash: "from-rose-100 via-orange-50 to-amber-100 text-rose-700",
  },
  accessories: {
    icon: Sparkles,
    wash: "from-amber-100 via-yellow-50 to-orange-100 text-amber-700",
  },
  hardware: {
    icon: Cpu,
    wash: "from-sky-100 via-slate-50 to-indigo-100 text-sky-800",
  },
};

function look(category: string) {
  return (
    art[category.trim().toLowerCase()] ?? {
      icon: Package,
      wash: "from-indigo-100 via-slate-50 to-blue-100 text-indigo-700",
    }
  );
}

const ProductCard = ({
  name,
  id,
  description,
  price,
  stock,
  imageUrl,
  category,
  featured,
  openModal,
  onDeleted,
}: Product & {
  openModal?: (id: string) => void;
  onClick?: (id: string | null) => void;
  onDeleted?: () => void;
}) => {
  const { user } = useAuth();
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const visual = look(category || "");
  const Icon = visual.icon;

  const deleteProduct = async () => {
    try {
      await api(`/products/${id}`, { method: "DELETE" });
      onDeleted?.();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {imageUrl ? (
          // Remote product photos are not limited to a known host.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${visual.wash}`}
          >
            <Icon size={40} strokeWidth={1.5} />
          </div>
        )}
        {featured && (
          <span className="absolute left-3 top-3 rounded-full bg-slate-950/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        {category && (
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {category}
          </p>
        )}
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-950">
          {name}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {description}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <p className="text-xl font-bold tracking-tight text-slate-950">
            {money(price)}
          </p>
          <p
            className={`text-xs font-semibold ${stock > 0 ? "text-emerald-700" : "text-rose-600"}`}
          >
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </p>
        </div>

        {user?.role === "admin" && (
          <div className="mt-4 border-t border-slate-100 pt-4">
            {isLandingPage ? (
              <Link
                href="/manage-products"
                className="text-sm font-semibold text-blue-700 hover:text-blue-800"
              >
                Manage product
              </Link>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => openModal?.(id)}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-900"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void deleteProduct()}
                  className="text-sm font-semibold text-rose-600 hover:text-rose-800"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
