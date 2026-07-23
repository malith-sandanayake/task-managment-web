import { Router } from "express";

import {
  createTaskController,
  deleteTaskController,
  getDashboardStatsController,
  getTaskController,
  getTasksController,
  updateTaskController,
} from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get("/dashboard/stats", asyncHandler(getDashboardStatsController));

router.post("/", asyncHandler(createTaskController));
router.get("/", asyncHandler(getTasksController));
router.get("/:id", asyncHandler(getTaskController));
router.put("/:id", asyncHandler(updateTaskController));
router.delete("/:id", asyncHandler(deleteTaskController));

export default router;