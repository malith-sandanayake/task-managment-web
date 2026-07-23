import { TaskCard } from "./TaskCard";

import type {
  Task,
} from "../types/task.types";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  updatingTaskId: number | null;
  onRetry: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (
    task: Task,
  ) => Promise<void>;
}

export function TaskList({
  tasks,
  isLoading,
  error,
  updatingTaskId,
  onRetry,
  onEdit,
  onDelete,
  onComplete,
}: TaskListProps): JSX.Element {
  if (isLoading) {
    return (
      <div
        className="dashboard-loading"
        role="status"
      >
        Loading tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="dashboard-error"
        role="alert"
      >
        <span>{error}</span>

        <button
          type="button"
          onClick={onRetry}
        >
          Try again
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="task-placeholder">
        No tasks match the current filters.
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onComplete={onComplete}
          isUpdating={
            updatingTaskId === task.id
          }
        />
      ))}
    </div>
  );
}
