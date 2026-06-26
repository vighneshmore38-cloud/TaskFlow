// Centralized constants so every dropdown / badge / validation rule
// pulls from the same source instead of re-typing string literals.

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

export const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

export const TYPE_OPTIONS = ["Bug", "Feature", "Improvement", "General"];

export const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

// Lower rank = shown first. This is what lets us say "completed sinks
// to the bottom" without hardcoding if/else chains everywhere we sort.
export const STATUS_RANK = {
  Pending: 0,
  "In Progress": 1,
  Completed: 2,
};

export const PRIORITY_RANK = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
};

// Maps a priority/status string to the "rail" CSS class defined in index.css
export const priorityRail = {
  Low: "rail-low",
  Medium: "rail-medium",
  High: "rail-high",
  Critical: "rail-critical",
};

export const statusRail = {
  Pending: "rail-pending",
  "In Progress": "rail-inprogress",
  Completed: "rail-completed",
};

// Tailwind color utility classes per priority / status, for badges
export const priorityBadge = {
  Low: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  High: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  Critical: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export const statusBadge = {
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "In Progress": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export const roleBadge = {
  admin: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  user: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
};

export const STORAGE_KEYS = {
  USER: "taskflow_user",
  TOKEN: "taskflow_token",
  THEME: "taskflow_theme",
};
