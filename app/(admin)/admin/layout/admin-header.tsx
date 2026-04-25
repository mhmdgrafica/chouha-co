"use client";

import {
  Bell,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react";

type AdminHeaderProps = {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onOpenMobileSidebar: () => void;
};

export function AdminHeader({
  isSidebarCollapsed,
  onToggleSidebar,
  onOpenMobileSidebar,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-[#f7f5ef]/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="inline-flex rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition hover:text-slate-900 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 transition hover:text-slate-900 lg:inline-flex"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Chouha Admin
            </h1>
            <p className="text-sm text-slate-500">
              Manage products, brands, and categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 md:flex">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>

          <button
            type="button"
            className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 transition hover:text-slate-900"
          >
            <Bell size={18} />
          </button>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}