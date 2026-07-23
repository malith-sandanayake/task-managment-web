import type { NextFunction, Request, Response } from "express";
export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}
export declare function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.middleware.d.ts.map