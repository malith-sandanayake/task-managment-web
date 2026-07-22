import mysql from "mysql2/promise";
import dotenv from "dotenv/config";

const {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
} = process.env

if (!DB_HOST || DB_PASSWORD === undefined || !DB_USER || !DB_NAME){
    throw new Error("Required environment variables are missing");
};

// debug 
/*onst missing: string[] = [];

if (!DB_HOST) missing.push("DB_HOST");
if (DB_PASSWORD === undefined) missing.push("DB_PASSWORD");
if (!DB_USER) missing.push("DB_USER");
if (!DB_NAME) missing.push("DB_NAME");

if (missing.length > 0) {
    console.error(`[DEBUG] Database initialization halted due to missing variables: ${missing.join(', ')}`);
    throw new Error(`Required environment variables are missing: ${missing.join(', ')}`);
}*/

export const db = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT ?? 3306),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});