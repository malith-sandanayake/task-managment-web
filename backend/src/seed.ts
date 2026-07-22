import "dotenv/config";
import bcrypt from "bcrypt";
import { db } from "./config/database.js";

async function seed(): Promise<void> {
    const email = "admin@test.com";
    const plainPassword = "123456";

    try {
        const passwordHash = await bcrypt.hash(plainPassword, 12);

        await db.execute(
            `
      INSERT INTO users (name, email, password)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        password = VALUES(password)
      `,
            ["Admin User", email, passwordHash],
        );

        console.log("Seed completed successfully");
        console.log(`Email: ${email}`);
        console.log(`Password: ${plainPassword}`);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exitCode = 1;
    } finally {
        await db.end();
    }
}

void seed();