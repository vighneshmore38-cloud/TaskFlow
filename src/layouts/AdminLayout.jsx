import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

const TITLES = {
  "/admin/dashboard": "Dashboard",
  "/admin/users": "User Management",
  "/admin/tasks": "Task Management",
  "/admin/logs": "Activity Logs",
};

/**
 * Shell for every /admin/* route. The actual page (Dashboard, Users, etc.)
 * renders wherever <Outlet /> sits, via the nested routes in routes/AppRoutes.jsx.
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Navbar title={TITLES[pathname] || "Admin"} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
