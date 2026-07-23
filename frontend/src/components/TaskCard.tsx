import type {
  Task,
} from "../types/task.types";
import { formatDate } from "../utils/date";
import {
  taskPriorityLabels,
  taskStatusLabels,
} from "../utils/taskLabels";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onComplete: (
    task: Task,
  ) => Promise<void>;
  isUpdating: boolean;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onComplete,
  isUpdating,
}: TaskCardProps): JSX.Element {
  const isOverdue =
    task.status !== "COMPLETED" &&
    task.dueDate <
      new Date().toISOString().slice(0, 10);

  return (
    <article className="task-card">
      <div className="task-card__header">
        <div>
          <h3>{task.title}</h3>

          <p className="task-card__description">
            {task.description?.trim() ||
              "No description provided."}
          </p>
        </div>

        <span
          className={`priority-badge priority-badge--${task.priority.toLowerCase()}`}
        >
          {taskPriorityLabels[task.priority]}
        </span>
      </div>

      <div className="task-card__meta">
        <span
          className={`status-badge status-badge--${task.status.toLowerCase()}`}
        >
          {taskStatusLabels[task.status]}
        </span>

        <span
          className={
            isOverdue
              ? "due-date due-date--overdue"
              : "due-date"
          }
        >
          Due {formatDate(task.dueDate)}
          {isOverdue ? " · Overdue" : ""}
        </span>
      </div>

      <div className="task-card__actions">
        {task.status !== "COMPLETED" && (
          <button
            className="complete-button"
            type="button"
            onClick={() => {
              void onComplete(task);
            }}
            disabled={isUpdating}
          >
            {isUpdating
              ? "Updating..."
              : "Mark complete"}
          </button>
        )}

        <button
          className="secondary-button"
          type="button"
          onClick={() => {
            onEdit(task);
          }}
          disabled={isUpdating}
        >
          Edit
        </button>

        <button
          className="danger-outline-button"
          type="button"
          onClick={() => {
            onDelete(task);
          }}
          disabled={isUpdating}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
