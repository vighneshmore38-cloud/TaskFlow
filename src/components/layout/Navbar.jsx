import { useState, useRef, useEffect } from "react";
import { FiMenu, FiLogOut, FiChevronDown, FiUser, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useNavigate } from "react-router-dom";

/**
 * Top navbar shown inside both AdminLayout and UserLayout.
 * `onMenuClick` opens the mobile sidebar drawer.
 */
export default function Navbar({ title, onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[var(--color-ink-soft)] hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <FiMenu className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-semibold text-[var(--color-ink)]">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-[var(--color-ink-soft)] hover:bg-slate-100"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-[var(--color-primary)]">
              {user?.fullName?.charAt(0) || <FiUser />}
            </span>
            <span className="hidden text-sm font-medium text-[var(--color-ink)] sm:block">
              {user?.fullName}
            </span>
            <FiChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {menuOpen && (
            <div className="animate-fade-in absolute right-0 mt-2 w-48 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-1.5 shadow-lg">
              <div className="px-3 py-2">
                <p className="truncate text-sm font-medium text-[var(--color-ink)]">{user?.email}</p>
                <p className="text-xs capitalize text-[var(--color-ink-soft)]">{user?.role} account</p>
              </div>
              <hr className="my-1 border-[var(--color-border)]" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--color-danger)] hover:bg-red-50"
              >
                <FiLogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
