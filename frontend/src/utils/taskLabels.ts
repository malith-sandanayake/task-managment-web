import type {
  TaskPriority,
  TaskStatus,
} from "../types/task.types";

export const taskStatusLabels: Record<
  TaskStatus,
  string
> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export const taskPriorityLabels: Record<
  TaskPriority,
  string
> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};
