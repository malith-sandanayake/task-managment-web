import type { Task, TaskQuery, DashboardStats } from "../types/task.types.js";
import type { CreateTaskInput, UpdateTaskInput } from "../validators/task.validator.js";
export declare function createTaskService(userId: number, input: CreateTaskInput): Promise<Task | null>;
export declare function getTasksService(userId: number, query: TaskQuery): Promise<Task[]>;
export declare function getTaskService(taskId: number, userId: number): Promise<Task | null>;
export declare function updateTaskService(taskId: number, userId: number, input: UpdateTaskInput): Promise<Task | null>;
export declare function deleteTaskService(taskId: number, userId: number): Promise<boolean>;
export declare function getDashboardStatsService(userId: number): Promise<DashboardStats>;
//# sourceMappingURL=task.service.d.ts.map