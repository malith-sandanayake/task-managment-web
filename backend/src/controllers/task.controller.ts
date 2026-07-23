import type { Response } from "express";

import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import {
  createTaskService,
  deleteTaskService,
  getTaskService,
  getTasksService,
  updateTaskService,
} from "../services/task.service.js";
import {
  createTaskSchema,
  taskIdSchema,
  updateTaskSchema,
} from "../validators/task.validator.js";

export async function createTaskController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const result = createTaskSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const task = await createTaskService(userId, result.data);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: {
      task,
    },
  });
}

export async function getTasksController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const tasks = await getTasksService(userId);

  res.status(200).json({
    success: true,
    data: {
      tasks,
    },
  });
}

export async function getTaskController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const idResult = taskIdSchema.safeParse(req.params);

  if (!idResult.success) {
    res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
    return;
  }

  const task = await getTaskService(idResult.data.id, userId);

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      task,
    },
  });
}

export async function updateTaskController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const idResult = taskIdSchema.safeParse(req.params);

  if (!idResult.success) {
    res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
    return;
  }

  const bodyResult = updateTaskSchema.safeParse(req.body);

  if (!bodyResult.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: bodyResult.error.flatten().fieldErrors,
    });
    return;
  }

  const task = await updateTaskService(
    idResult.data.id,
    userId,
    bodyResult.data,
  );

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found or no changes were provided",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: {
      task,
    },
  });
}

export async function deleteTaskController(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
    return;
  }

  const idResult = taskIdSchema.safeParse(req.params);

  if (!idResult.success) {
    res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
    return;
  }

  const deleted = await deleteTaskService(
    idResult.data.id,
    userId,
  );

  if (!deleted) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
}