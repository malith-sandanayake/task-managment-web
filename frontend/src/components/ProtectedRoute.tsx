import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function ProtectedRoute(): JSX.Element {
  const {
    isAuthenticated,
    isLoading,
  } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
