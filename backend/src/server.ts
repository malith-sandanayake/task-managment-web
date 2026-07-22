import "dotenv/config";
import { db } from "./config/database.js";
import app from "./app.js";

const port = Number(process.env.PORT ?? 5000);

async function startServer (): Promise<void>{
    try{
        const connection = await db.getConnection();

        console.log("Database connection estabilished.")

        connection.release();
        
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`)
        });

    }catch(error){
        console.log("Could not connect to database", error);
        process.exit(1);
    }
}

void startServer;