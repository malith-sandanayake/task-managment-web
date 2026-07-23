import axios from "axios";
import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import {
  createTaskRequest,
  deleteTaskRequest,
  getDashboardStatsRequest,
  getTasksRequest,
  updateTaskRequest,
} from "../api/task.api";
import { DeleteTaskDialog } from "../components/DeleteTaskDialog";
import { StatCard } from "../components/StatCard";
import { TaskFilters } from "../components/TaskFilters";
import { TaskList } from "../components/TaskList";
import { TaskModal } from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import type {
  CreateTaskInput,
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

  const { showToast } = useToast();

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

  const [isTaskModalOpen, setIsTaskModalOpen] =
    useState(false);

  const [selectedTask, setSelectedTask] =
    useState<Task | null>(null);

  const [taskToDelete, setTaskToDelete] =
    useState<Task | null>(null);

  const [isSubmittingTask, setIsSubmittingTask] =
    useState(false);

  const [isDeletingTask, setIsDeletingTask] =
    useState(false);

  const [taskFormError, setTaskFormError] =
    useState<string | null>(null);

  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const [updatingTaskId, setUpdatingTaskId] =
    useState<number | null>(null);

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

  const refreshDashboard =
    useCallback(async (): Promise<void> => {
      await Promise.all([
        loadStats(),
        loadTasks(),
      ]);
    }, [loadStats, loadTasks]);

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

  function openCreateTask(): void {
    setSelectedTask(null);
    setTaskFormError(null);
    setIsTaskModalOpen(true);
  }

  function openEditTask(task: Task): void {
    setSelectedTask(task);
    setTaskFormError(null);
    setIsTaskModalOpen(true);
  }

  function closeTaskModal(): void {
    if (isSubmittingTask) {
      return;
    }

    setIsTaskModalOpen(false);
    setSelectedTask(null);
    setTaskFormError(null);
  }

  async function handleTaskSubmit(
    input: CreateTaskInput,
  ): Promise<void> {
    setIsSubmittingTask(true);
    setTaskFormError(null);

    try {
      if (selectedTask) {
        await updateTaskRequest(
          selectedTask.id,
          input,
        );
      } else {
        await createTaskRequest(input);
      }

      showToast(
        selectedTask
          ? "Task updated successfully."
          : "Task created successfully.",
        "success",
      );

      closeTaskModal();
      await refreshDashboard();
    } catch (error: unknown) {
      setTaskFormError(
        getErrorMessage(
          error,
          selectedTask
            ? "Unable to update the task."
            : "Unable to create the task.",
        ),
      );
    } finally {
      setIsSubmittingTask(false);
    }
  }

  function openDeleteDialog(
    task: Task,
  ): void {
    setTaskToDelete(task);
    setDeleteError(null);
  }

  function closeDeleteDialog(): void {
    if (isDeletingTask) {
      return;
    }

    setTaskToDelete(null);
    setDeleteError(null);
  }

  async function handleDeleteTask(): Promise<void> {
    if (!taskToDelete) {
      return;
    }

    setIsDeletingTask(true);
    setDeleteError(null);

    try {
      await deleteTaskRequest(
        taskToDelete.id,
      );

      showToast(
        "Task deleted successfully.",
        "success",
      );

      setTaskToDelete(null);
      await refreshDashboard();
    } catch (error: unknown) {
      setDeleteError(
        getErrorMessage(
          error,
          "Unable to delete the task.",
        ),
      );
    } finally {
      setIsDeletingTask(false);
    }
  }

  async function handleCompleteTask(
    task: Task,
  ): Promise<void> {
    setUpdatingTaskId(task.id);

    try {
      await updateTaskRequest(
        task.id,
        {
          status: "COMPLETED",
        },
      );

      showToast(
        "Task marked as completed.",
        "success",
      );

      await refreshDashboard();
    } catch (error: unknown) {
      setTasksError(
        getErrorMessage(
          error,
          "Unable to mark the task as completed.",
        ),
      );
    } finally {
      setUpdatingTaskId(null);
    }
  }

  function handleLogout(): void {
    logout();

    showToast(
      "You have been logged out.",
      "info",
    );

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
                Search, filter, sort, and manage
                your tasks.
              </p>
            </div>

            <button
              className="primary-button create-task-button"
              type="button"
              onClick={openCreateTask}
            >
              Create task
            </button>
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
            updatingTaskId={updatingTaskId}
            onRetry={() => {
              void loadTasks();
            }}
            onEdit={openEditTask}
            onDelete={openDeleteDialog}
            onComplete={handleCompleteTask}
          />
        </section>
      </main>

      {isTaskModalOpen && (
        <TaskModal
          task={selectedTask}
          isSubmitting={isSubmittingTask}
          error={taskFormError}
          onSubmit={handleTaskSubmit}
          onClose={closeTaskModal}
        />
      )}

      {taskToDelete && (
        <DeleteTaskDialog
          task={taskToDelete}
          isDeleting={isDeletingTask}
          error={deleteError}
          onConfirm={handleDeleteTask}
          onCancel={closeDeleteDialog}
        />
      )}
    </div>
  );
}
