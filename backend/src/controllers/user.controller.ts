import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";

export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> {
  const userId = req.user?.id;

  console.log(userId);
}