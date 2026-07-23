import { apiClient } from "./client";

import type {
  CreateTaskInput,
  DashboardStatsResponse,
  DeleteTaskResponse,
  TaskQuery,
  TaskResponse,
  TasksResponse,
  UpdateTaskInput,
} from "../types/task.types";

function buildTaskQuery(
  query: TaskQuery,
): URLSearchParams {
  const params = new URLSearchParams();

  if (query.search?.trim()) {
    params.set(
      "search",
      query.search.trim(),
    );
  }

  if (query.status) {
    params.set("status", query.status);
  }

  if (query.priority) {
    params.set("priority", query.priority);
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  return params;
}

export async function getTasksRequest(
  query: TaskQuery = {},
): Promise<TasksResponse> {
  const params = buildTaskQuery(query);

  const response =
    await apiClient.get<TasksResponse>(
      "/tasks",
      {
        params,
      },
    );

  return response.data;
}

export async function getTaskRequest(
  taskId: number,
): Promise<TaskResponse> {
  const response =
    await apiClient.get<TaskResponse>(
      `/tasks/${taskId}`,
    );

  return response.data;
}

export async function createTaskRequest(
  input: CreateTaskInput,
): Promise<TaskResponse> {
  const response =
    await apiClient.post<TaskResponse>(
      "/tasks",
      input,
    );

  return response.data;
}

export async function updateTaskRequest(
  taskId: number,
  input: UpdateTaskInput,
): Promise<TaskResponse> {
  const response =
    await apiClient.put<TaskResponse>(
      `/tasks/${taskId}`,
      input,
    );

  return response.data;
}

export async function deleteTaskRequest(
  taskId: number,
): Promise<DeleteTaskResponse> {
  const response =
    await apiClient.delete<DeleteTaskResponse>(
      `/tasks/${taskId}`,
    );

  return response.data;
}

export async function getDashboardStatsRequest(): Promise<DashboardStatsResponse> {
  const response =
    await apiClient.get<DashboardStatsResponse>(
      "/tasks/dashboard/stats",
    );

  return response.data;
}
