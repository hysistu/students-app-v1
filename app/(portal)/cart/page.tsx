"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookOpen, Trash2, ShoppingCart } from "lucide-react";
import { useAuth } from "@/components/auth";
import { useCart } from "@/components/cart-context";
import { Empty, Notice, PageHeader } from "@/components/ui";
import { api, money } from "@/lib/api";
import type { Cart } from "@/lib/types";
export default function CartPage() {
  const { refreshCart } = useCart();
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (user?.role === "student")
      api<Cart>("/cart")
        .then(setCart)
        .catch((e) => setError(e.message));
  }, [user]);
  async function remove(id: string) {
    try {
      setCart(await api<Cart>(`/cart/items/${id}`, { method: "DELETE" }));
      await refreshCart();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function clear() {
    try {
      setCart(await api<Cart>("/cart", { method: "DELETE" }));
      await refreshCart();
    } catch (e) {
      setError((e as Error).message);
    }
  }
  async function checkout() {
    setBusy(true);
    setError("");
    try {
      await api("/cart/checkout", { method: "POST" });
      setCart(await api<Cart>("/cart"));
      setMessage("Enrollment complete! Your courses are ready.");
      await refreshCart();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (user?.role !== "student")
    return <Notice message="The cart is for students." />;
  return (
    <>
      <PageHeader
        title="Your cart"
        description="Review courses before enrolling."
        action={
          cart?.count ? (
            <button className="btn btn-light" onClick={() => void clear()}>
              Clear cart
            </button>
          ) : undefined
        }
      />
      {error && <Notice message={error} onClose={() => setError("")} />}{" "}
      {message && (
        <div className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          {message}{" "}
          <Link href="/my-courses" className="font-bold underline">
            View my courses
          </Link>
        </div>
      )}
      {cart === null && !error && (
        <p className="text-sm text-slate-500">Loading cart…</p>
      )}
      {cart?.count === 0 && (
        <Empty
          title="Your cart is empty"
          description="Explore the course catalog and add a course."
        />
      )}
      {cart && cart.count > 0 && (
        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <div
                className="card flex items-center gap-4 p-4"
                key={item.course.id}
              >
                <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-100">
                  {item.course.imageUrl ? (
                    <img
                      src={item.course.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <BookOpen className="text-blue-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/courses/${item.course.id}`}
                    className="font-bold hover:text-blue-600"
                  >
                    {item.course.title}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.course.instructor?.name || "Course instructor"} ·
                    Quantity 1
                  </p>
                  <p className="mt-1 font-semibold">{money(item.subtotal)}</p>
                </div>
                <button
                  aria-label={`Remove ${item.course.title}`}
                  className="p-2 text-red-600"
                  onClick={() => void remove(item.course.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
          <aside className="card h-fit p-6">
            <h2 className="text-lg font-bold">Order summary</h2>
            <div className="my-5 flex justify-between border-b border-slate-100 pb-5 text-sm">
              <span>
                {cart.count} course{cart.count === 1 ? "" : "s"}
              </span>
              <span>{money(cart.total)}</span>
            </div>
            <div className="mb-6 flex justify-between font-bold">
              <span>Total</span>
              <span>{money(cart.total)}</span>
            </div>
            <button
              className="btn btn-primary w-full"
              disabled={busy}
              onClick={() => void checkout()}
            >
              <ShoppingCart size={17} />
              {busy ? "Enrolling…" : "Checkout & enroll"}
            </button>
            <p className="mt-3 text-xs text-slate-500">
              Demo checkout records enrollment. No payment is collected.
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
