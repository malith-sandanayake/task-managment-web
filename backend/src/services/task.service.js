import { createTask, deleteTaskById, findTaskById, findTasksByUser, getDashboardStatsByUser, updateTaskById, } from "../repositories/task.repository.js";
export async function createTaskService(userId, input) {
    const taskId = await createTask(userId, input);
    return findTaskById(taskId, userId);
}
export async function getTasksService(userId, query) {
    return findTasksByUser(userId, query);
}
export async function getTaskService(taskId, userId) {
    return findTaskById(taskId, userId);
}
export async function updateTaskService(taskId, userId, input) {
    const updated = await updateTaskById(taskId, userId, input);
    if (!updated) {
        return null;
    }
    return findTaskById(taskId, userId);
}
export async function deleteTaskService(taskId, userId) {
    return deleteTaskById(taskId, userId);
}
export async function getDashboardStatsService(userId) {
    return getDashboardStatsByUser(userId);
}
//# sourceMappingURL=task.service.js.map