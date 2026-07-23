import {
  useEffect,
  type KeyboardEvent,
} from "react";

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
  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    function handleEscape(
      event: globalThis.KeyboardEvent,
    ): void {
      if (
        event.key === "Escape" &&
        !isSubmitting
      ) {
        onClose();
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
  }, [isSubmitting, onClose]);

  function stopKeyboardPropagation(
    event: KeyboardEvent<HTMLDivElement>,
  ): void {
    event.stopPropagation();
  }

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <div
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-label={
          task
            ? "Edit task"
            : "Create task"
        }
        onKeyDown={
          stopKeyboardPropagation
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
