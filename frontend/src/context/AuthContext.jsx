import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

// Auth context owns login/register/profile state for the full app.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("Froyal AmityUser") || "null"); } catch { return null; }
  });

  // Revalidate the HttpOnly cookie so stale local profile data cannot unlock the dashboard.
  useEffect(() => {
    if (!user) {
      setIsAuthLoading(false);
      return;
    }

    let isActive = true;
    setIsAuthLoading(true);

    api.get("/auth/me")
      .then(({ data }) => {
        if (!isActive) return;
        setUser(data);
        localStorage.setItem("Froyal AmityUser", JSON.stringify(data));
      })
      .catch(() => {
        if (!isActive) return;
        setUser(null);
        localStorage.removeItem("Froyal AmityUser");
      })
      .finally(() => {
        if (isActive) setIsAuthLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  // Stores the profile persistently and keeps the bearer fallback available when cookies are blocked.
  const persistUser = useCallback((userData) => {
    const { token, ...rawUser } = userData ?? {};
    const role = rawUser?.role || (rawUser?.isAdmin ? "admin" : "customer");
    const safeUser = rawUser ? { ...rawUser, role, isAdmin: role === "admin" } : null;

    setUser(safeUser);
    if (safeUser) {
      localStorage.setItem("Froyal AmityUser", JSON.stringify(safeUser));
    } else {
      localStorage.removeItem("Froyal AmityUser");
    }
    if (token) localStorage.setItem("Froyal AmityAccessToken", token);
  }, []);

  // Calls backend login and stores the returned token.
  const login = useCallback(async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistUser(data);
    return data;
  }, [persistUser]);

  // Calls backend registration and stores the returned token.
  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    persistUser(data);
    return data;
  }, [persistUser]);

  // Clears the local session.
  const logout = useCallback(async () => {
    try { await api.post("/auth/logout"); } catch { /* local logout still succeeds */ }
    setUser(null);
    localStorage.removeItem("Froyal AmityUser");
    localStorage.removeItem("Froyal AmityAccessToken");
    sessionStorage.removeItem("Froyal AmityAccessToken");
  }, []);

  const value = useMemo(() => ({ user, isAuthLoading, login, register, logout, persistUser }), [user, isAuthLoading, login, register, logout, persistUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
