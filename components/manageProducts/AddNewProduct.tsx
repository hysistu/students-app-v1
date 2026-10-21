"use client";
import React from "react";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";

type ProductForm = {
  name: string;
  description: string;
  imageUrl: string;
  price: string;
  stock: string;
  category: string;
  status: "active" | "inactive";
  featured: boolean;
};

const initialForm: ProductForm = {
  name: "",
  description: "",
  imageUrl: "",
  price: "",
  stock: "0",
  category: "",
  status: "active",
  featured: false,
};

const AddNewProduct = ({
  id,
  onCreated,
}: {
  id?: string;
  onCreated?: () => void;
}) => {
  const [form, setForm] = React.useState<ProductForm>(initialForm);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Load the single product when an id is provided; reset when there is none.
  React.useEffect(() => {
    if (!id) {
      setForm(initialForm);
      return;
    }
    setLoading(true);
    setError(null);
    // TODO: replace with the single-product API url
    api<{ product: Product }>(`/products/${id}`)
      .then(({ product }) =>
        setForm({
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl ?? "",
          price: String(product.price),
          stock: String(product.stock),
          category: product.category ?? "",
          status: product.status,
          featured: product.featured,
        }),
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const set = <K extends keyof ProductForm>(key: K, value: ProductForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      await api(id ? `/products/${id}` : "/products", {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify(payload),
      });
      setForm(initialForm);
      onCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full min-w-[min(28rem,80vw)]">
      <h2 className="mb-5 text-xl font-bold text-slate-900">
        {id ? "Manage Product" : "Add New Product"}
      </h2>
      {loading && <p className="mb-4 text-sm text-slate-500">Loading…</p>}

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            Name
          </label>
          <input
            id="name"
            className="field"
            required
            minLength={2}
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Product name"
          />
        </div>

        <div>
          <label htmlFor="description" className="label">
            Description
          </label>
          <textarea
            id="description"
            className="field min-h-24 resize-y"
            required
            minLength={5}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Describe the product"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="label">
            Image URL
          </label>
          <input
            id="imageUrl"
            type="url"
            className="field"
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="label">
              Price (€)
            </label>
            <input
              id="price"
              type="number"
              min={0}
              step="0.01"
              required
              className="field"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label htmlFor="stock" className="label">
              Stock
            </label>
            <input
              id="stock"
              type="number"
              min={0}
              step={1}
              className="field"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="label">
              Category
            </label>
            <input
              id="category"
              className="field"
              maxLength={60}
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="e.g. Books"
            />
          </div>
          <div>
            <label htmlFor="status" className="label">
              Status
            </label>
            <select
              id="status"
              className="field"
              value={form.status}
              onChange={(e) =>
                set("status", e.target.value as ProductForm["status"])
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured on landing page (admin only)
        </label>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Saving…" : id ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  );
};

export default AddNewProduct;
