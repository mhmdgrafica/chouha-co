"use client";

import { useState, type ReactNode } from "react";
import { AdminSidebar } from "./layout/admin-sidebar";
import { AdminHeader } from "./layout/admin-header";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const openMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-slate-900">
      <div className="flex min-h-screen">
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={closeMobileSidebar}
          onToggleCollapse={toggleSidebar}
        />

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <AdminHeader
            isSidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={toggleSidebar}
            onOpenMobileSidebar={openMobileSidebar}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}