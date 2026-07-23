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
}

export function TaskCard({
  task,
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
    </article>
  );
}
