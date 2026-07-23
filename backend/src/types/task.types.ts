export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export interface Task {
  id: number;
  userId: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}