import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products Guide · TechLab",
  description: "What to build on the front end for the Products API",
};

type Endpoint = {
  method: string;
  path: string;
  who: string;
  note: string;
};

const publicEndpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/public/products/featured?limit=8",
    who: "Anyone",
    note: "Landing page (/). Active products an admin marked featured. Returns { items: Product[] }.",
  },
  {
    method: "GET",
    path: "/api/public/products",
    who: "Anyone",
    note: "Full public shop. Query: search, category, minPrice, maxPrice, page, limit. Returns { items, pagination }.",
  },
  {
    method: "GET",
    path: "/api/public/products/:id",
    who: "Anyone",
    note: "Product detail page. Returns { product }. 404 if inactive or missing.",
  },
];

const managedEndpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/products",
    who: "Admin, Seller",
    note: "Table. Seller gets only their own. Admin may filter by owner. Query: search, status, featured, page, limit.",
  },
  {
    method: "GET",
    path: "/api/products/:id",
    who: "Admin, owning Seller",
    note: "Edit form data. Returns { product } with owner populated.",
  },
  {
    method: "POST",
    path: "/api/products",
    who: "Admin, Seller",
    note: "Body: name, description, price, stock, category, imageUrl, status. Admin may add ownerId (a seller) and featured. Seller sending featured gets 403.",
  },
  {
    method: "PATCH",
    path: "/api/products/:id",
    who: "Admin, owning Seller",
    note: "Send only changed fields. featured and ownerId are admin-only (403 for sellers).",
  },
  {
    method: "DELETE",
    path: "/api/products/:id",
    who: "Admin, owning Seller",
    note: "Returns 204 with no body.",
  },
];

const steps = [
  {
    title: "1. Add the seller role",
    body: 'In lib/types.ts change Role to include "seller". Update every place that switches on role: the sidebar in app/(portal)/layout.tsx (sellers see only Products and Profile), the redirect after login, and the role dropdown on the Users page (admin can create sellers through POST /api/users with role: "seller").',
  },
  {
    title: "2. Landing page at /",
    body: 'app/page.tsx currently redirects to /dashboard. Replace it with a public page that fetches /api/public/products/featured and shows a product grid (image, name, price, category). Add a Login button. Remove the redirect, and make sure proxy.ts does not protect "/" (it does not today, since it is not in the matcher). Fetch on the server so it works without a session.',
  },
  {
    title: "3. Public shop (optional)",
    body: "Create /shop with search, category and price filters plus pagination using /api/public/products, and /shop/[id] for details using /api/public/products/:id.",
  },
  {
    title: "4. Products management page",
    body: "Create app/(portal)/products/page.tsx. Table with search, status filter and pagination, plus Create, Edit and Delete actions (reuse the pattern from the Courses page). Add /products to the proxy.ts matcher so it needs a session.",
  },
  {
    title: "5. Role-aware form",
    body: "Everyone: name, description, price, stock, category, imageUrl, status. Admin only: a seller select (load sellers from GET /api/users?role=seller, send as ownerId) and a Featured on landing page checkbox. Hide those two fields for sellers, because the API rejects them with 403.",
  },
  {
    title: "6. Errors and states",
    body: 'The API returns { error: "message" }; lib/api.ts already throws it as ApiError. Show loading and empty states. A deleted or reassigned product returns 404 or 403, so handle both.',
  },
];

const shape = `type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;      // "" when none
  price: number;
  stock: number;
  category: string;
  status: "active" | "inactive";   // management endpoints only
  featured: boolean;
  owner: { id: string; name: string; email: string };  // management endpoints
  createdAt: string;
};
// Public endpoints return seller: { id, name } instead of owner,
// and never return inactive products.`;

const accounts = [
  ["Admin", "admin@example.com"],
  ["Seller", "seller@example.com"],
];

function Method({ value }: { value: string }) {
  const color =
    value === "GET"
      ? "bg-emerald-100 text-emerald-700"
      : value === "DELETE"
        ? "bg-red-100 text-red-700"
        : "bg-blue-100 text-blue-700";
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-bold ${color}`}>
      {value}
    </span>
  );
}

function Table({ rows }: { rows: Endpoint[] }) {
  return (
    <div className="space-y-3">
      {rows.map((e) => (
        <div key={e.method + e.path} className="card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Method value={e.method} />
            <code className="text-sm font-semibold text-slate-900">
              {e.path}
            </code>
            <span className="ml-auto text-xs font-medium text-slate-500">
              {e.who}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-600">{e.note}</p>
        </div>
      ))}
    </div>
  );
}

export default function ProductsGuidePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
          Frontend guide
        </p>
        <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900">
          Products
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          The API already supports products, a new seller role and a public
          landing feed. Nothing is built on this side yet. This page lists the
          endpoints to call and the pages to create.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Who can do what
        </h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Admin</th>
                <th className="px-4 py-2">Seller</th>
                <th className="px-4 py-2">Instructor / Student</th>
                <th className="px-4 py-2">Visitor</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {[
                ["See landing and public shop", "Yes", "Yes", "Yes", "Yes"],
                ["List and view products", "All", "Own", "No", "No"],
                ["Create, edit, delete", "All", "Own", "No", "No"],
                ["Set featured (landing page)", "Yes", "No", "No", "No"],
                ["Reassign product to another seller", "Yes", "No", "No", "No"],
              ].map((r) => (
                <tr key={r[0]} className="border-t border-slate-100">
                  {r.map((c, i) => (
                    <td key={i} className="px-4 py-2">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Public endpoints (no login)
        </h2>
        <Table rows={publicEndpoints} />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-slate-900">
          Management endpoints (session cookie required)
        </h2>
        <Table rows={managedEndpoints} />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-slate-900">Product shape</h2>
        <pre className="card overflow-x-auto p-4 text-xs text-slate-800">
          {shape}
        </pre>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xl font-bold text-slate-900">What to build</h2>
        <ol className="space-y-3">
          {steps.map((s) => (
            <li key={s.title} className="card p-4">
              <h3 className="font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="card p-6">
        <h2 className="text-xl font-bold text-slate-900">Demo accounts</h2>
        <p className="mt-1 text-sm text-slate-600">
          Run <code>npm run seed:demo</code> in the API. Seller password:{" "}
          <code>ChangeMe123!</code>. Admin password is ADMIN_PASSWORD in the API
          .env.
        </p>
        <ul className="mt-3 text-sm text-slate-700">
          {accounts.map(([role, email]) => (
            <li key={email}>
              {role}: <code>{email}</code>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
