import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  getDashboardStatsRequest,
  getTasksRequest,
} from "../api/task.api";
import { StatCard } from "../components/StatCard";
import { TaskFilters } from "../components/TaskFilters";
import { TaskList } from "../components/TaskList";
import { useAuth } from "../context/AuthContext";
import type {
  DashboardStats,
  Task,
  TaskQuery,
} from "../types/task.types";

const emptyStats: DashboardStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
};

const initialTaskQuery: TaskQuery = {
  search: "",
  status: undefined,
  priority: undefined,
  sort: "newest",
};

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  return fallback;
}

export function DashboardPage(): JSX.Element {
  const navigate = useNavigate();

  const {
    logout,
    user,
  } = useAuth();

  const [stats, setStats] =
    useState<DashboardStats>(emptyStats);

  const [tasks, setTasks] =
    useState<Task[]>([]);

  const [taskQuery, setTaskQuery] =
    useState<TaskQuery>(initialTaskQuery);

  const [isStatsLoading, setIsStatsLoading] =
    useState(true);

  const [isTasksLoading, setIsTasksLoading] =
    useState(true);

  const [statsError, setStatsError] =
    useState<string | null>(null);

  const [tasksError, setTasksError] =
    useState<string | null>(null);

  const loadStats =
    useCallback(async (): Promise<void> => {
      setIsStatsLoading(true);
      setStatsError(null);

      try {
        const response =
          await getDashboardStatsRequest();

        setStats(response.data.stats);
      } catch (error: unknown) {
        setStatsError(
          getErrorMessage(
            error,
            "Unable to load dashboard statistics.",
          ),
        );
      } finally {
        setIsStatsLoading(false);
      }
    }, []);

  const loadTasks =
    useCallback(async (): Promise<void> => {
      setIsTasksLoading(true);
      setTasksError(null);

      try {
        const response =
          await getTasksRequest(taskQuery);

        setTasks(response.data.tasks);
      } catch (error: unknown) {
        setTasksError(
          getErrorMessage(
            error,
            "Unable to load tasks.",
          ),
        );
      } finally {
        setIsTasksLoading(false);
      }
    }, [taskQuery]);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => {
        void loadTasks();
      },
      300,
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadTasks]);

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
              disabled={isStatsLoading}
            >
              {isStatsLoading
                ? "Refreshing..."
                : "Refresh"}
            </button>
          </div>

          {statsError && (
            <div
              className="dashboard-error"
              role="alert"
            >
              <span>{statsError}</span>

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

          {isStatsLoading && !statsError ? (
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
                Search, filter, and sort your tasks.
              </p>
            </div>
          </div>

          <TaskFilters
            query={taskQuery}
            isLoading={isTasksLoading}
            onChange={setTaskQuery}
            onRefresh={() => {
              void loadTasks();
            }}
          />

          <TaskList
            tasks={tasks}
            isLoading={isTasksLoading}
            error={tasksError}
            onRetry={() => {
              void loadTasks();
            }}
          />
        </section>
      </main>
    </div>
  );
}
