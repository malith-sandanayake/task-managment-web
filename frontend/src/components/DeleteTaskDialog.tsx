import type {
  Task,
} from "../types/task.types";

interface DeleteTaskDialogProps {
  task: Task;
  isDeleting: boolean;
  error: string | null;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function DeleteTaskDialog({
  task,
  isDeleting,
  error,
  onConfirm,
  onCancel,
}: DeleteTaskDialogProps): JSX.Element {
  return (
    <div className="modal-backdrop">
      <div
        className="delete-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <h2 id="delete-dialog-title">
          Delete task?
        </h2>

        <p>
          This will permanently delete{" "}
          <strong>{task.title}</strong>.
        </p>

        {error && (
          <div
            className="form-alert"
            role="alert"
          >
            {error}
          </div>
        )}

        <div className="task-form-actions">
          <button
            className="secondary-button"
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            className="danger-button"
            type="button"
            onClick={() => {
              void onConfirm();
            }}
            disabled={isDeleting}
          >
            {isDeleting
              ? "Deleting..."
              : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
