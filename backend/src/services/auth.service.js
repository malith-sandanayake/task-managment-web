import { db } from '../config/database.js';
import bcrypt from 'bcrypt';
export async function loginUser(email, password) {
    const [rows] = await db.execute(`
        SELECT id, name, email, password
        FROM users
        WHERE email = ?
        LIMIT 1
        `, [email]);
    const user = rows[0];
    if (!user) {
        return null;
    }
    ;
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return null;
    }
    ;
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}
// query user by id 
export async function getUserById(userId) {
    const [rows] = await db.execute(`
    SELECT id, name, email
    FROM users
    WHERE id = ?
    LIMIT 1
    `, [userId]);
    return rows[0] ?? null;
}
//# sourceMappingURL=auth.service.js.map