import { Router } from "express";
import { getCurrentUser, login } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", login);       // authRoute
router.get("/me", requireAuth, getCurrentUser);     // profileRoute

export default router;