import { createTaskService, deleteTaskService, getDashboardStatsService, getTaskService, getTasksService, updateTaskService, } from "../services/task.service.js";
import { createTaskSchema, taskIdSchema, taskQuerySchema, updateTaskSchema, } from "../validators/task.validator.js";
export async function createTaskController(req, res) {
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
export async function getTasksController(req, res) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }
    const queryResult = taskQuerySchema.safeParse(req.query);
    if (!queryResult.success) {
        res.status(400).json({
            success: false,
            message: "Invalid query parameters",
            errors: queryResult.error.flatten().fieldErrors,
        });
        return;
    }
    const query = {
        sort: queryResult.data.sort,
    };
    if (queryResult.data.search !== undefined) {
        query.search = queryResult.data.search;
    }
    if (queryResult.data.status !== undefined) {
        query.status = queryResult.data.status;
    }
    if (queryResult.data.priority !== undefined) {
        query.priority = queryResult.data.priority;
    }
    const tasks = await getTasksService(userId, query);
    res.status(200).json({
        success: true,
        data: {
            tasks,
        },
    });
}
export async function getTaskController(req, res) {
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
export async function updateTaskController(req, res) {
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
    const task = await updateTaskService(idResult.data.id, userId, bodyResult.data);
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
export async function deleteTaskController(req, res) {
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
    const deleted = await deleteTaskService(idResult.data.id, userId);
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
export async function getDashboardStatsController(req, res) {
    const userId = req.user?.id;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
        return;
    }
    const stats = await getDashboardStatsService(userId);
    res.status(200).json({
        success: true,
        data: {
            stats,
        },
    });
}
//# sourceMappingURL=task.controller.js.map