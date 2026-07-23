export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED";

export type TaskSort =
  | "newest"
  | "oldest"
  | "dueDate";

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

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export interface TaskQuery {
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: TaskSort;
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export type UpdateTaskInput =
  Partial<CreateTaskInput>;

export interface TasksResponse {
  success: boolean;
  data: {
    tasks: Task[];
  };
}

export interface TaskResponse {
  success: boolean;
  message?: string;
  data: {
    task: Task;
  };
}

export interface DeleteTaskResponse {
  success: boolean;
  message: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: {
    stats: DashboardStats;
  };
}
