import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/authService";
import { recordActivity } from "../services/logService";
import { STORAGE_KEYS } from "../utils/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // `loading` covers the brief moment we read localStorage on first mount,
  // so ProtectedRoute doesn't redirect to /login before we know the session exists.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    }
    setLoading(false);
  }, []);

  async function login({ email, password }) {
    const { user: loggedInUser, token } = await authService.login({ email, password });
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(loggedInUser));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    setUser(loggedInUser);
    recordActivity({ userId: loggedInUser.id, action: "logged in" });
    return loggedInUser;
  }

  function logout() {
    if (user) {
      recordActivity({ userId: user.id, action: "logged out" });
    }
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    setUser(null);
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook so components do `const { user, logout } = useAuth()`
// instead of importing useContext + AuthContext everywhere.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }
  return ctx;
}
