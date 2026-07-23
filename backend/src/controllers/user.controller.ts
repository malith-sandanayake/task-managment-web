import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const _userId = req.user?.id;
  res.status(501).json({ success: false, message: "Not implemented" });
}