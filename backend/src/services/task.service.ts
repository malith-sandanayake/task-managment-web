import type { Task, TaskQuery } from "../types/task.types.js";
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "../validators/task.validator.js";

import {
  createTask,
  deleteTaskById,
  findTaskById,
  findTasksByUser,
  updateTaskById,
} from "../repositories/task.repository.js";

export async function createTaskService(
  userId: number,
  input: CreateTaskInput,
): Promise<Task | null> {
  const taskId = await createTask(userId, input);

  return findTaskById(taskId, userId);
}

export async function getTasksService(
  userId: number,
  query: TaskQuery,
): Promise<Task[]> {
  return findTasksByUser(userId, query);
}

export async function getTaskService(
  taskId: number,
  userId: number,
): Promise<Task | null> {
  return findTaskById(taskId, userId);
}

export async function updateTaskService(
  taskId: number,
  userId: number,
  input: UpdateTaskInput,
): Promise<Task | null> {
  const updated = await updateTaskById(
    taskId,
    userId,
    input,
  );

  if (!updated) {
    return null;
  }

  return findTaskById(taskId, userId);
}

export async function deleteTaskService(
  taskId: number,
  userId: number,
): Promise<boolean> {
  return deleteTaskById(taskId, userId);
}