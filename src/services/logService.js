import { saveAs } from "file-saver";
import api from "./api";
import seedLogs from "../data/logs";
import { mockDelay, arrayToCSV, getUserName, formatDate } from "../utils/helpers";

let logsStore = [...seedLogs];

export async function getLogs() {
  // ---- Real backend call ----
  // const { data } = await api.get("/logs");
  // return data;

  return mockDelay([...logsStore].reverse(), 500);
}

// Appends a new activity entry. Call this from anywhere a meaningful
// action happens (task created/completed, user created, login, etc.)
// so the activity log stays accurate without a backend.
export function recordActivity({ userId, action, taskId = null, taskName = "—" }) {
  const now = new Date();
  const entry = {
    id: `l${logsStore.length + 1}`,
    userId,
    action,
    taskId,
    taskName,
    date: now.toISOString().slice(0, 10),
    time: now.toTimeString().slice(0, 5),
  };
  logsStore = [...logsStore, entry];
  return entry;
}

// Builds a CSV from the current logs and triggers a browser download
// using file-saver. Works fully client-side, no backend required.
export async function downloadLogs() {
  // ---- Real backend alternative ----
  // const response = await api.get("/logs/export", { responseType: "blob" });
  // saveAs(response.data, `activity-log-${Date.now()}.csv`);
  // return;

  const rows = [...logsStore].reverse();
  const csv = arrayToCSV(rows, [
    { label: "User", accessor: (r) => getUserName(r.userId) },
    { label: "Action", accessor: (r) => r.action },
    { label: "Task", accessor: (r) => r.taskName },
    { label: "Date", accessor: (r) => formatDate(r.date) },
    { label: "Time", accessor: (r) => r.time },
  ]);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `activity-log-${new Date().toISOString().slice(0, 10)}.csv`);
}

export default { getLogs, recordActivity, downloadLogs };
