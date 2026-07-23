import { useEffect } from "react";

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
  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleEscape(
      event: KeyboardEvent,
    ): void {
      if (
        event.key === "Escape" &&
        !isDeleting
      ) {
        onCancel();
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [isDeleting, onCancel]);

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isDeleting
        ) {
          onCancel();
        }
      }}
    >
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
