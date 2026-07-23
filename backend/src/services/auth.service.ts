import { db } from '../config/database.js';
import type { RowDataPacket } from 'mysql2';
import bcrypt from 'bcrypt';

interface UserRow extends RowDataPacket {
        id: number;
        name: string;
        email: string;
        password: string;
}

interface SafeUser {
    id: number;
    name: string;
    email: string;
}

export async function loginUser(email: string, password: string): Promise <SafeUser | null>{

    const [rows] = await db.execute<UserRow[]>(
        `
        SELECT id, name, email, password
        FROM users
        WHERE email = ?
        LIMIT 1
        `, 
        [email],
    );

    const user = rows[0];

    if (!user){
        return null;
    };

    const passwordMatch = await bcrypt.compare(
        password, user.password
    );

    if (!passwordMatch){
        return null;
    };

    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}