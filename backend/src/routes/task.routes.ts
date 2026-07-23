import { Router } from "express";

import {
  createTaskController,
  deleteTaskController,
  getTaskController,
  getTasksController,
  updateTaskController,
} from "../controllers/task.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post("/", createTaskController);
router.get("/", getTasksController);
router.get("/:id", getTaskController);
router.put("/:id", updateTaskController);
router.delete("/:id", deleteTaskController);

export default router;