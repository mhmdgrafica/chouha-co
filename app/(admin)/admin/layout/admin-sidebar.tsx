"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Package,
  Tags,
  Shapes,
  SlidersHorizontal,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Brands",
    href: "/admin/brands",
    icon: Tags,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: Shapes,
  },
  {
    label: "Options",
    href: "/admin/options",
    icon: SlidersHorizontal,
  },
];

type AdminSidebarProps = {
  isCollapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleCollapse: () => void;
};

export function AdminSidebar({
  isCollapsed,
  mobileOpen,
  onCloseMobile,
  onToggleCollapse,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-40 bg-slate-900/30 transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onCloseMobile}
      />

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:static lg:z-auto",
          isCollapsed ? "lg:w-[92px]" : "lg:w-[280px]",
          mobileOpen
            ? "translate-x-0 w-[280px]"
            : "-translate-x-full w-[280px] lg:translate-x-0"
        )}
      >
        <div
          className={clsx(
            "border-b border-slate-200 py-6",
            isCollapsed ? "px-3 lg:px-3" : "px-6"
          )}
        >
          <div
            className={clsx(
              "flex items-center",
              isCollapsed ? "justify-center" : "justify-between"
            )}
          >
            {isCollapsed ? (
              <button
                type="button"
                onClick={onToggleCollapse}
                className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>
            ) : (
              <>
                <Link href="/admin" className="block min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Chouha
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    Admin Panel
                  </h2>
                </Link>

                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="hidden rounded-2xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:inline-flex"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose size={18} />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onCloseMobile}
              className="rounded-2xl border border-slate-200 p-2 text-slate-600 lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <nav
          className={clsx(
            "flex-1 space-y-2 py-6",
            isCollapsed ? "px-3" : "px-4"
          )}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={clsx(
                  "flex items-center rounded-2xl text-sm font-medium transition-all",
                  isCollapsed
                    ? "justify-center px-3 py-3"
                    : "gap-3 px-4 py-3",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={18} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}