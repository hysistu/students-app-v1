"use client";

import { api } from "@/lib/api";
import { PageResult, Product } from "@/lib/types";
import React, { useEffect } from "react";
import ProductCard from "./ProductCard";
import Pagination from "@/components/pagination";

const AllProducts = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState<number>(1);
  const [limit] = React.useState<number>(9);
  const [total, setTotal] = React.useState<number>(0);

  useEffect(() => {
    setLoading(true);
    api<PageResult<Product>>(`/public/products?page=${page}&limit=${limit}`)
      .then((result) => {
        setProducts(result.items);
        setTotal(result.pagination.total);
        setError(null);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [page, limit]);

  return (
    <section id="products" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            Catalogue
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            In the shop
          </h2>
        </div>
        {!loading && !error && (
          <p className="text-sm text-slate-500">
            {total} product{total === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </p>
      )}

      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
            >
              <div className="aspect-[4/3] animate-pulse bg-slate-100" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            Nothing in the shop yet
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Products will show up here once they are published.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}

      <Pagination
        currentPage={page}
        limit={limit}
        total={total}
        onPageChange={(p) => {
          setPage(p);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </section>
  );
};

export default AllProducts;
