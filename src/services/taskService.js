import api from "./api";
import seedTasks from "../data/tasks";
import { mockDelay } from "../utils/helpers";

let tasksStore = [...seedTasks];
let nextId = tasksStore.length + 1;

export async function getTasks() {
  // ---- Real backend call ----
  // const { data } = await api.get("/tasks");
  // return data;

  return mockDelay([...tasksStore], 500);
}

export async function createTask(payload) {
  // ---- Real backend call ----
  // const { data } = await api.post("/tasks", payload);
  // return data;

  const newTask = {
    id: `t${nextId++}`,
    status: "Pending",
    completedAt: null,
    completedBy: null,
    createdAt: new Date().toISOString(),
    ...payload,
  };
  tasksStore = [newTask, ...tasksStore];
  return mockDelay(newTask, 500);
}

export async function updateTask(id, payload) {
  // ---- Real backend call ----
  // const { data } = await api.put(`/tasks/${id}`, payload);
  // return data;

  tasksStore = tasksStore.map((t) => (t.id === id ? { ...t, ...payload } : t));
  const updated = tasksStore.find((t) => t.id === id);
  return mockDelay(updated, 500);
}

export async function deleteTask(id) {
  // ---- Real backend call ----
  // await api.delete(`/tasks/${id}`);
  // return { id };

  tasksStore = tasksStore.filter((t) => t.id !== id);
  return mockDelay({ id }, 400);
}

// Convenience wrapper used by the User dashboard's "Mark as completed" action.
// Internally just calls updateTask, but keeps intent explicit at the call site.
export async function completeTask(id, completedByUserId) {
  return updateTask(id, {
    status: "Completed",
    completedAt: new Date().toISOString(),
    completedBy: completedByUserId,
  });
}

// Convenience wrapper used by the Admin "Assign Task" action.
export async function assignTask(id, assigneeUserId) {
  return updateTask(id, { assignedTo: assigneeUserId });
}

export default { getTasks, createTask, updateTask, deleteTask, completeTask, assignTask };
