import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL,
    }),
);

app.use(express.json());

// health route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);  // task routes


export default app;