import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUsers,
  FiCheckSquare,
  FiActivity,
  FiList,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { classNames } from "../../utils/helpers";

const ADMIN_LINKS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/admin/users", label: "Users", icon: FiUsers },
  { to: "/admin/tasks", label: "Tasks", icon: FiCheckSquare },
  { to: "/admin/logs", label: "Activity Logs", icon: FiActivity },
];

const USER_LINKS = [
  { to: "/user/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/user/tasks", label: "My Tasks", icon: FiCheckSquare },
  { to: "/user/all-tasks", label: "All Tasks", icon: FiList },
];

/**
 * Sidebar renders a different nav-link set depending on role.
 * `isOpen` / `onClose` control the mobile slide-over drawer behaviour.
 */
export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const links = user?.role === "admin" ? ADMIN_LINKS : USER_LINKS;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={classNames(
          "thin-scrollbar fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-[var(--color-sidebar)] transition-transform duration-200 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] font-display font-bold text-white">
              T
            </span>
            <span className="font-display text-lg font-semibold text-white">TaskFlow</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white lg:hidden" aria-label="Close menu">
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                classNames(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-slate-300 hover:bg-[var(--color-sidebar-hover)] hover:text-white"
                )
              }
            >
              <Icon className="h-4.5 w-4.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="m-3 rounded-xl bg-[var(--color-sidebar-hover)] p-3">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="truncate text-sm font-medium text-white">{user?.fullName}</p>
          <span className="mt-1 inline-block rounded-full bg-white/10 px-2 py-0.5 text-xs capitalize text-slate-200">
            {user?.role}
          </span>
        </div>
      </aside>
    </>
  );
}
