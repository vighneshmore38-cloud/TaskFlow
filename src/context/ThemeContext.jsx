import { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS } from "../utils/constants";

const ThemeContext = createContext(null);

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === "light" || stored === "dark") return stored;
  // First-ever visit, nothing saved yet: respect the OS-level preference
  // rather than forcing light mode on someone whose system is set to dark.
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Whenever `theme` changes, toggle the `.dark` class on <html> (the
  // actual mechanism that switches every CSS variable defined in
  // index.css) and remember the choice for next time.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside a <ThemeProvider>");
  }
  return ctx;
}
