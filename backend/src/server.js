import "dotenv/config";
import { db } from "./config/database.js";
import app from "./app.js";
const PORT = Number(process.env.PORT ?? 5000);
async function startServer() {
    try {
        const connection = await db.getConnection();
        console.log("Database connection estabilished.");
        connection.release();
        const server = app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
        async function shutdown(signal) {
            console.log(`${signal} received. Shutting down...`);
            server.close(async () => {
                await db.end();
                console.log("Database pool closed");
                process.exit(0);
            });
        }
        process.on("SIGINT", () => {
            void shutdown("SIGINT");
        });
        process.on("SIGTERM", () => {
            void shutdown("SIGTERM");
        });
    }
    catch (error) {
        console.log("Could not connect to database", error);
        process.exit(1);
    }
}
void startServer();
//# sourceMappingURL=server.js.map