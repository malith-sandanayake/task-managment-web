import type {
  CreateTaskInput,
  Task,
} from "../types/task.types";
import { TaskForm } from "./TaskForm";

interface TaskModalProps {
  task: Task | null;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (
    input: CreateTaskInput,
  ) => Promise<void>;
  onClose: () => void;
}

export function TaskModal({
  task,
  isSubmitting,
  error,
  onSubmit,
  onClose,
}: TaskModalProps): JSX.Element {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-label={
          task ? "Edit task" : "Create task"
        }
      >
        <TaskForm
          task={task}
          isSubmitting={isSubmitting}
          error={error}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
