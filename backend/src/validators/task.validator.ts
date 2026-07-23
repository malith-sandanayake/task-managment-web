import { z } from "zod";

const prioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"]);

const statusSchema = z.enum([
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
]);

const today = new Date();
today.setHours(0, 0, 0, 0);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title must be 150 characters or fewer"),

  description: z
    .string()
    .trim()
    .max(2000, "Description must be 2000 characters or fewer")
    .optional()
    .nullable(),

  priority: prioritySchema,

  status: statusSchema.default("PENDING"),

  dueDate: z.coerce
    .date()
    .refine(
      (date) => date >= today,
      "Due date cannot be earlier than today",
    ),
});

export const updateTaskSchema = createTaskSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "At least one field must be provided",
  },
);

export const taskIdSchema = z.object({
  id: z.coerce
    .number()
    .int("Task ID must be an integer")
    .positive("Task ID must be positive"),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;