import type { Task, TaskQuery, DashboardStats } from "../types/task.types.js";
import type { CreateTaskInput, UpdateTaskInput } from "../validators/task.validator.js";
export declare function createTask(userId: number, input: CreateTaskInput): Promise<number>;
export declare function findTaskById(taskId: number, userId: number): Promise<Task | null>;
export declare function findTasksByUser(userId: number, query: TaskQuery): Promise<Task[]>;
export declare function updateTaskById(taskId: number, userId: number, input: UpdateTaskInput): Promise<boolean>;
export declare function deleteTaskById(taskId: number, userId: number): Promise<boolean>;
export declare function getDashboardStatsByUser(userId: number): Promise<DashboardStats>;
//# sourceMappingURL=task.repository.d.ts.map