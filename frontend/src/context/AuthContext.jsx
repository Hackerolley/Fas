import { createContext, useContext, useState } from "react";
import api from "../api/axios";

// Auth context owns login/register/profile state for the full app.
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("Froyal AmityUser") || "null"));

  // Saves authenticated user data and token locally.
  const persistUser = (userData) => {
    setUser(userData);
    localStorage.setItem("Froyal AmityUser", JSON.stringify(userData));
  };

  // Calls backend login and stores the returned token.
  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistUser(data);
    return data;
  };

  // Calls backend registration and stores the returned token.
  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    persistUser(data);
    return data;
  };

  // Clears the local session.
  const logout = () => {
    setUser(null);
    localStorage.removeItem("Froyal AmityUser");
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
