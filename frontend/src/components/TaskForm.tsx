import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import type {
  CreateTaskInput,
  Task,
  TaskPriority,
  TaskStatus,
} from "../types/task.types";
import { getTodayDateInput } from "../utils/date";

interface TaskFormErrors {
  title?: string;
  dueDate?: string;
  general?: string;
}

interface TaskFormProps {
  task: Task | null;
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (
    input: CreateTaskInput,
  ) => Promise<void>;
  onCancel: () => void;
}

const initialInput: CreateTaskInput = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "PENDING",
  dueDate: getTodayDateInput(),
};

export function TaskForm({
  task,
  isSubmitting,
  error,
  onSubmit,
  onCancel,
}: TaskFormProps): JSX.Element {
  const [input, setInput] =
    useState<CreateTaskInput>(initialInput);

  const [errors, setErrors] =
    useState<TaskFormErrors>({});

  useEffect(() => {
    if (task) {
      setInput({
        title: task.title,
        description: task.description ?? "",
        priority: task.priority,
        status: task.status,
        dueDate: task.dueDate.slice(0, 10),
      });
    } else {
      setInput({
        ...initialInput,
        dueDate: getTodayDateInput(),
      });
    }

    setErrors({});
  }, [task]);

  function validate(): TaskFormErrors {
    const nextErrors: TaskFormErrors = {};

    if (!input.title.trim()) {
      nextErrors.title = "Title is required";
    }

    if (!input.dueDate) {
      nextErrors.dueDate =
        "Due date is required";
    }

    return nextErrors;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const validationErrors = validate();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    await onSubmit({
      ...input,
      title: input.title.trim(),
      description:
        input.description?.trim() || null,
    });
  }

  return (
    <form
      className="task-form"
      onSubmit={(event) => {
        void handleSubmit(event);
      }}
      noValidate
    >
      <div className="modal-heading">
        <div>
          <h2>
            {task ? "Edit task" : "Create task"}
          </h2>

          <p>
            {task
              ? "Update the task details below."
              : "Add a new task to your dashboard."}
          </p>
        </div>

        <button
          className="modal-close"
          type="button"
          onClick={onCancel}
          aria-label="Close task form"
        >
          ×
        </button>
      </div>

      {error && (
        <div
          className="form-alert"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="task-title">
          Title
        </label>

        <input
          id="task-title"
          type="text"
          value={input.title}
          onChange={(event) => {
            setInput((current) => ({
              ...current,
              title: event.target.value,
            }));

            if (errors.title) {
              setErrors((current) => ({
                ...current,
                title: undefined,
              }));
            }
          }}
          aria-invalid={Boolean(errors.title)}
        />

        {errors.title && (
          <p className="field-error">
            {errors.title}
          </p>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="task-description">
          Description
        </label>

        <textarea
          id="task-description"
          rows={4}
          value={input.description ?? ""}
          onChange={(event) => {
            setInput((current) => ({
              ...current,
              description: event.target.value,
            }));
          }}
        />
      </div>

      <div className="task-form-grid">
        <div className="form-field">
          <label htmlFor="task-priority">
            Priority
          </label>

          <select
            id="task-priority"
            value={input.priority}
            onChange={(event) => {
              setInput((current) => ({
                ...current,
                priority:
                  event.target.value as TaskPriority,
              }));
            }}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">
              Medium
            </option>
            <option value="HIGH">High</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="task-status">
            Status
          </label>

          <select
            id="task-status"
            value={input.status}
            onChange={(event) => {
              setInput((current) => ({
                ...current,
                status:
                  event.target.value as TaskStatus,
              }));
            }}
          >
            <option value="PENDING">
              Pending
            </option>
            <option value="IN_PROGRESS">
              In progress
            </option>
            <option value="COMPLETED">
              Completed
            </option>
          </select>
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="task-due-date">
          Due date
        </label>

        <input
          id="task-due-date"
          type="date"
          value={input.dueDate}
          onChange={(event) => {
            setInput((current) => ({
              ...current,
              dueDate: event.target.value,
            }));

            if (errors.dueDate) {
              setErrors((current) => ({
                ...current,
                dueDate: undefined,
              }));
            }
          }}
          aria-invalid={Boolean(
            errors.dueDate,
          )}
        />

        {errors.dueDate && (
          <p className="field-error">
            {errors.dueDate}
          </p>
        )}
      </div>

      <div className="task-form-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>

        <button
          className="primary-button task-submit-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : task
              ? "Save changes"
              : "Create task"}
        </button>
      </div>
    </form>
  );
}
