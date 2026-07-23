import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardStatsRequest } from "../api/task.api";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import type {
  DashboardStats,
} from "../types/task.types";

const emptyStats: DashboardStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
};

export function DashboardPage(): JSX.Element {
  const navigate = useNavigate();

  const {
    logout,
    user,
  } = useAuth();

  const [stats, setStats] =
    useState<DashboardStats>(emptyStats);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadStats =
    useCallback(async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response =
          await getDashboardStatsRequest();

        setStats(response.data.stats);
      } catch (requestError: unknown) {
        if (axios.isAxiosError(requestError)) {
          const message =
            requestError.response?.data?.message;

          setError(
            typeof message === "string"
              ? message
              : "Unable to load dashboard statistics.",
          );
        } else {
          setError(
            "Unable to load dashboard statistics.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  function handleLogout(): void {
    logout();

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">
            Task Management System
          </p>

          <h1>Dashboard</h1>

          <p className="dashboard-welcome">
            Welcome back,{" "}
            <strong>
              {user?.name ?? "User"}
            </strong>
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Task overview</h2>

              <p>
                A summary of your current tasks.
              </p>
            </div>

            <button
              className="refresh-button"
              type="button"
              onClick={() => {
                void loadStats();
              }}
              disabled={isLoading}
            >
              {isLoading
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>

          {error && (
            <div
              className="dashboard-error"
              role="alert"
            >
              <span>{error}</span>

              <button
                type="button"
                onClick={() => {
                  void loadStats();
                }}
              >
                Try again
              </button>
            </div>
          )}

          {isLoading && !error ? (
            <div
              className="dashboard-loading"
              role="status"
            >
              Loading dashboard statistics...
            </div>
          ) : (
            <div className="stats-grid">
              <StatCard
                label="Total tasks"
                value={stats.total}
                variant="total"
              />

              <StatCard
                label="Pending"
                value={stats.pending}
                variant="pending"
              />

              <StatCard
                label="In progress"
                value={stats.inProgress}
                variant="progress"
              />

              <StatCard
                label="Completed"
                value={stats.completed}
                variant="completed"
              />

              <StatCard
                label="Overdue"
                value={stats.overdue}
                variant="overdue"
              />
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <div>
              <h2>Your tasks</h2>

              <p>
                The task list will be added in the
                next section.
              </p>
            </div>
          </div>

          <div className="task-placeholder">
            Task list coming next.
          </div>
        </section>
      </main>
    </div>
  );
}
