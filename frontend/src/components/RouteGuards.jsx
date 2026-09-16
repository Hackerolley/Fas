import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RequireAuth = ({ children }) => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  if (isAuthLoading) return null;
  return user ? children : <Navigate to="/login" replace state={{ from: location.pathname }} />;
};

export const RequireAdmin = ({ children }) => {
  const { user, isAuthLoading } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  if (isAuthLoading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return isAdmin ? children : <Navigate to="/" replace />;
};
