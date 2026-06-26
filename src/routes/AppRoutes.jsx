import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import RoleRedirect from "./RoleRedirect";

import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminTasks from "../pages/admin/Tasks";
import AdminLogs from "../pages/admin/Logs";

import UserLayout from "../layouts/UserLayout";
import UserDashboard from "../pages/user/Dashboard";
import UserTasks from "../pages/user/Tasks";
import UserAllTasks from "../pages/user/AllTasks";

import { ROLES } from "../utils/constants";

/**
 * The entire route map for the app.
 *
 * - "/"        -> RoleRedirect decides where to send the visitor
 * - "/login"   -> public
 * - "/admin/*" -> wrapped in ProtectedRoute(allowedRoles=["admin"]) + AdminLayout
 * - "/user/*"  -> wrapped in ProtectedRoute(allowedRoles=["user"]) + UserLayout
 * - "*"        -> 404
 */
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RoleRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="tasks" element={<AdminTasks />} />
          <Route path="logs" element={<AdminLogs />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.USER]} />}>
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="tasks" element={<UserTasks />} />
          <Route path="all-tasks" element={<UserAllTasks />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
