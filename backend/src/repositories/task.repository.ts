import type {
  ResultSetHeader,
  RowDataPacket,
} from "mysql2";

import { db } from "../config/database.js";
import type { Task } from "../types/task.types.js";
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "../validators/task.validator.js";

interface TaskRow extends RowDataPacket {
  id: number;
  user_id: number;
  title: string;
  description: string | null;
  priority: Task["priority"];
  status: Task["status"];
  due_date: Date | string;
  created_at: Date | string;
  updated_at: Date | string;
}

type QueryValue = string | number | Date | null;

function formatDateOnly(value: Date | string): string {
  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

function formatTimestamp(value: Date | string): string {
  return value instanceof Date
    ? value.toISOString()
    : value;
}

function mapTaskRow(task: TaskRow): Task {
  return {
    id: task.id,
    userId: task.user_id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: formatDateOnly(task.due_date),
    createdAt: formatTimestamp(task.created_at),
    updatedAt: formatTimestamp(task.updated_at),
  };
}

// Create task
export async function createTask(
  userId: number,
  input: CreateTaskInput,
): Promise<number> {
  const [result] = await db.execute<ResultSetHeader>(
    `
    INSERT INTO tasks (
      user_id,
      title,
      description,
      priority,
      status,
      due_date
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      input.title,
      input.description ?? null,
      input.priority,
      input.status,
      input.dueDate,
    ],
  );

  return result.insertId;
}

// Retrieve one task by ID
export async function findTaskById(
  taskId: number,
  userId: number,
): Promise<Task | null> {
  const [rows] = await db.execute<TaskRow[]>(
    `
    SELECT
      id,
      user_id,
      title,
      description,
      priority,
      status,
      due_date,
      created_at,
      updated_at
    FROM tasks
    WHERE id = ? AND user_id = ?
    LIMIT 1
    `,
    [taskId, userId],
  );

  const task = rows[0];

  return task ? mapTaskRow(task) : null;
}

// Retrieve all tasks for a user
export async function findTasksByUser(
  userId: number,
): Promise<Task[]> {
  const [rows] = await db.execute<TaskRow[]>(
    `
    SELECT
      id,
      user_id,
      title,
      description,
      priority,
      status,
      due_date,
      created_at,
      updated_at
    FROM tasks
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId],
  );

  return rows.map(mapTaskRow);
}

// Update task
export async function updateTaskById(
  taskId: number,
  userId: number,
  input: UpdateTaskInput,
): Promise<boolean> {
  const fields: string[] = [];
  const values: QueryValue[] = [];

  if (input.title !== undefined) {
    fields.push("title = ?");
    values.push(input.title);
  }

  if (input.description !== undefined) {
    fields.push("description = ?");
    values.push(input.description);
  }

  if (input.priority !== undefined) {
    fields.push("priority = ?");
    values.push(input.priority);
  }

  if (input.status !== undefined) {
    fields.push("status = ?");
    values.push(input.status);
  }

  if (input.dueDate !== undefined) {
    fields.push("due_date = ?");
    values.push(input.dueDate);
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(taskId, userId);

  const [result] = await db.execute<ResultSetHeader>(
    `
    UPDATE tasks
    SET ${fields.join(", ")}
    WHERE id = ? AND user_id = ?
    `,
    values,
  );

  return result.affectedRows > 0;
}

// Delete task
export async function deleteTaskById(
  taskId: number,
  userId: number,
): Promise<boolean> {
  const [result] = await db.execute<ResultSetHeader>(
    `
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
    `,
    [taskId, userId],
  );

  return result.affectedRows > 0;
}