"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  LibraryBig,
} from "lucide-react";
import { useAuth } from "@/components/auth";
import { useCart } from "@/components/cart-context";
import type { Role } from "@/lib/types";
const navigation = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "instructor"],
  },
  { href: "/users", label: "Users", icon: Users, roles: ["admin"] },
  {
    href: "/students",
    label: "Students",
    icon: GraduationCap,
    roles: ["admin", "instructor"],
  },
  {
    href: "/courses",
    label: "Courses",
    icon: BookOpen,
    roles: ["admin", "instructor", "student"],
  },
  { href: "/cart", label: "Cart", icon: ShoppingCart, roles: ["student"] },
  {
    href: "/my-courses",
    label: "My courses",
    icon: LibraryBig,
    roles: ["student"],
  },
  {
    href: "/manage-products",
    label: "Manage Products",
    icon: LibraryBig,
    roles: ["admin", "seller"],
  },
];
export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count: cartCount } = useCart();
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);
  useEffect(() => {
    if (user?.role === "student" && pathname === "/dashboard")
      router.replace("/courses");
  }, [user, pathname, router]);
  if (loading || !user)
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-500">
        Loading your workspace…
      </div>
    );
  const links = navigation.filter((item) =>
    item.roles.includes(user.role as Role),
  );
  const isManageProductsPage = pathname.startsWith("/manage-products");

  return (
    <div className="min-h-screen lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200 bg-white p-5 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-9 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-lg font-bold"
          >
            <span className="rounded-xl bg-blue-600 p-2 text-white">
              <GraduationCap size={22} />
            </span>
            TechLab
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>
        <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
          Workspace
        </p>
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ${active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
              >
                <Icon size={19} />
                {item.label}
                {item.href === "/cart" && cartCount > 0 && (
                  <span className="ml-auto rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase text-slate-400">
            Signed in as
          </p>
          <p className="mt-1 truncate text-sm font-semibold">{user.name}</p>
          <p className="text-xs capitalize text-slate-500">{user.role}</p>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <div className="min-w-0 flex-1">
        <header className="flex h-18 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Menu />
            </button>
            <p className="text-sm text-slate-500">
              {isManageProductsPage
                ? "Manage Products"
                : "Student & Course Management"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs capitalize text-slate-500">{user.role}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {user.name[0]?.toUpperCase()}
            </span>
            <button
              onClick={() => void logout()}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              aria-label="Log out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-5 lg:p-9">{children}</main>
      </div>
    </div>
  );
}
