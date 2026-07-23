import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
export declare function login(req: Request, res: Response): Promise<void>;
export declare function getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map