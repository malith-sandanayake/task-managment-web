import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export function DashboardPage(): JSX.Element {
  const navigate = useNavigate();
  const {
    logout,
    user,
  } = useAuth();

  function handleLogout(): void {
    logout();
    navigate("/login", {
      replace: true,
    });
  }

  return (
    <main>
      <h1>Dashboard</h1>

      <p>
        Welcome, {user?.name ?? "User"}
      </p>

      <button
        type="button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </main>
  );
}
