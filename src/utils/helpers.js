import users from "../data/users";
import groups from "../data/groups";
import { STATUS_RANK, PRIORITY_RANK } from "./constants";

// Looks up a user's display name by id. Falls back gracefully so the UI
// never shows "undefined" if a record is missing (e.g. deleted user).
export function getUserName(userId) {
  if (!userId) return "—";
  const found = users.find((u) => u.id === userId);
  return found ? found.fullName : "Unknown user";
}

// Same idea, for groups. Returns "No group" for null/empty (a user who
// was never assigned one) vs "Unknown group" for an id that no longer
// matches anything (e.g. the group was deleted) — those are different
// situations and worth telling apart in the UI.
export function getGroupName(groupId) {
  if (!groupId) return "No group";
  const found = groups.find((g) => g.id === groupId);
  return found ? found.name : "Unknown group";
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return `${d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`;
}

// Converts an array of flat objects into a CSV string.
// Used by the activity-log download feature (combined with file-saver).
export function arrayToCSV(rows, columns) {
  const header = columns.map((c) => `"${c.label}"`).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const value = c.accessor(row);
          const safe = String(value ?? "").replace(/"/g, '""');
          return `"${safe}"`;
        })
        .join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Simulates network latency for dummy-data services so loading states
// (spinners/skeletons) behave the same way they will against a real API.
export function mockDelay(data, ms = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

/**
 * Orders tasks so Pending/In Progress float to the top and Completed
 * sinks to the bottom (ties broken by priority, Critical first).
 *
 * IMPORTANT: `[...tasks]` makes a shallow COPY before sorting.
 * Array.prototype.sort() mutates the array it's called on — calling it
 * directly on a value that came from React state would silently change
 * that state outside of setState, which breaks React's re-render tracking.
 * Always sort a copy.
 */
export function sortTasksForDisplay(tasks) {
  return [...tasks].sort((a, b) => {
    const statusDiff = STATUS_RANK[a.status] - STATUS_RANK[b.status];
    if (statusDiff !== 0) return statusDiff;
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });
}

// "Priya Sharma" -> "PS". Used for the small avatar circle on each board column.
export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

/**
 * Splits ONE flat array of tasks into several arrays — one per user —
 * instead of just re-ordering it. This is what powers the "Priya's tasks
 * in one column, Rohan's tasks in the next column" board layout.
 *
 * Each user gets a column even if they currently have zero tasks (so an
 * admin can see at a glance who's free), and any task with no assignee
 * lands in a trailing "Unassigned" column instead of disappearing.
 */
export function groupTasksByUser(tasks, users) {
  const columns = users.map((u) => ({
    userId: u.id,
    userName: u.fullName,
    tasks: sortTasksForDisplay(tasks.filter((t) => t.assignedTo === u.id)),
  }));

  const unassigned = sortTasksForDisplay(tasks.filter((t) => !t.assignedTo));
  if (unassigned.length > 0) {
    columns.push({ userId: "unassigned", userName: "Unassigned", tasks: unassigned });
  }

  return columns;
}
