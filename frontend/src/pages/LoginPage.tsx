import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function LoginPage(): JSX.Element {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main>
      <h1>Login</h1>
      <p>The login form will be added in the next step.</p>
    </main>
  );
}
