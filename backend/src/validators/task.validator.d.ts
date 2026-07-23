import { z } from "zod";
export declare const createTaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    priority: z.ZodEnum<{
        HIGH: "HIGH";
        LOW: "LOW";
        MEDIUM: "MEDIUM";
    }>;
    status: z.ZodDefault<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        PENDING: "PENDING";
    }>>;
    dueDate: z.ZodCoercedDate<unknown>;
}, z.core.$strip>;
export declare const updateTaskSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    priority: z.ZodOptional<z.ZodEnum<{
        HIGH: "HIGH";
        LOW: "LOW";
        MEDIUM: "MEDIUM";
    }>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        PENDING: "PENDING";
    }>>>;
    dueDate: z.ZodOptional<z.ZodCoercedDate<unknown>>;
}, z.core.$strip>;
export declare const taskIdSchema: z.ZodObject<{
    id: z.ZodCoercedNumber<unknown>;
}, z.core.$strip>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export declare const taskQuerySchema: z.ZodObject<{
    search: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        COMPLETED: "COMPLETED";
        IN_PROGRESS: "IN_PROGRESS";
        PENDING: "PENDING";
    }>>;
    priority: z.ZodOptional<z.ZodEnum<{
        HIGH: "HIGH";
        LOW: "LOW";
        MEDIUM: "MEDIUM";
    }>>;
    sort: z.ZodDefault<z.ZodEnum<{
        dueDate: "dueDate";
        newest: "newest";
        oldest: "oldest";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=task.validator.d.ts.map