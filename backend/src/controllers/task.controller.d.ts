import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare function createTaskController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getTasksController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getTaskController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function updateTaskController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function deleteTaskController(req: AuthenticatedRequest, res: Response): Promise<void>;
export declare function getDashboardStatsController(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=task.controller.d.ts.map