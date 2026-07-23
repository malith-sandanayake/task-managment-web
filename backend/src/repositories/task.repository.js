import { db } from "../config/database.js";
function formatDateOnly(value) {
    if (typeof value === "string") {
        return value.slice(0, 10);
    }
    return value.toISOString().slice(0, 10);
}
function formatTimestamp(value) {
    return value instanceof Date
        ? value.toISOString()
        : value;
}
function mapTaskRow(task) {
    return {
        id: task.id,
        userId: task.user_id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dueDate: formatDateOnly(task.due_date),
        createdAt: formatTimestamp(task.created_at),
        updatedAt: formatTimestamp(task.updated_at),
    };
}
// Create task
export async function createTask(userId, input) {
    const [result] = await db.execute(`
    INSERT INTO tasks (
      user_id,
      title,
      description,
      priority,
      status,
      due_date
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `, [
        userId,
        input.title,
        input.description ?? null,
        input.priority,
        input.status,
        input.dueDate,
    ]);
    return result.insertId;
}
// Retrieve one task by ID
export async function findTaskById(taskId, userId) {
    const [rows] = await db.execute(`
    SELECT
      id,
      user_id,
      title,
      description,
      priority,
      status,
      due_date,
      created_at,
      updated_at
    FROM tasks
    WHERE id = ? AND user_id = ?
    LIMIT 1
    `, [taskId, userId]);
    const task = rows[0];
    return task ? mapTaskRow(task) : null;
}
// Retrieve all tasks for a user
export async function findTasksByUser(userId, query) {
    const conditions = ["user_id = ?"];
    const values = [userId];
    if (query.search) {
        conditions.push("title LIKE ?");
        values.push(`%${query.search}%`);
    }
    if (query.status) {
        conditions.push("status = ?");
        values.push(query.status);
    }
    if (query.priority) {
        conditions.push("priority = ?");
        values.push(query.priority);
    }
    let orderBy = "created_at DESC";
    if (query.sort === "oldest") {
        orderBy = "created_at ASC";
    }
    if (query.sort === "dueDate") {
        orderBy = "due_date ASC";
    }
    const [rows] = await db.execute(`
    SELECT
      id,
      user_id,
      title,
      description,
      priority,
      status,
      due_date,
      created_at,
      updated_at
    FROM tasks
    WHERE ${conditions.join(" AND ")}
    ORDER BY ${orderBy}
    `, values);
    return rows.map(mapTaskRow);
}
// Update task
export async function updateTaskById(taskId, userId, input) {
    const fields = [];
    const values = [];
    if (input.title !== undefined) {
        fields.push("title = ?");
        values.push(input.title);
    }
    if (input.description !== undefined) {
        fields.push("description = ?");
        values.push(input.description);
    }
    if (input.priority !== undefined) {
        fields.push("priority = ?");
        values.push(input.priority);
    }
    if (input.status !== undefined) {
        fields.push("status = ?");
        values.push(input.status);
    }
    if (input.dueDate !== undefined) {
        fields.push("due_date = ?");
        values.push(input.dueDate);
    }
    if (fields.length === 0) {
        return false;
    }
    values.push(taskId, userId);
    const [result] = await db.execute(`
    UPDATE tasks
    SET ${fields.join(", ")}
    WHERE id = ? AND user_id = ?
    `, values);
    return result.affectedRows > 0;
}
// Delete task
export async function deleteTaskById(taskId, userId) {
    const [result] = await db.execute(`
    DELETE FROM tasks
    WHERE id = ? AND user_id = ?
    `, [taskId, userId]);
    return result.affectedRows > 0;
}
export async function getDashboardStatsByUser(userId) {
    const [rows] = await db.execute(`
    SELECT
      COUNT(*) AS total,

      SUM(status = 'PENDING') AS pending,

      SUM(status = 'IN_PROGRESS') AS in_progress,

      SUM(status = 'COMPLETED') AS completed,

      SUM(
        due_date < CURDATE()
        AND status <> 'COMPLETED'
      ) AS overdue

    FROM tasks
    WHERE user_id = ?
    `, [userId]);
    const stats = rows[0];
    return {
        total: Number(stats?.total ?? 0),
        pending: Number(stats?.pending ?? 0),
        inProgress: Number(stats?.in_progress ?? 0),
        completed: Number(stats?.completed ?? 0),
        overdue: Number(stats?.overdue ?? 0),
    };
}
//# sourceMappingURL=task.repository.js.map