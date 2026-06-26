// Dummy "logs table" — mirrors what GET /api/logs would return.
// In production, a log row would be inserted by the backend every time
// a meaningful action happens (login, task created, task completed, etc).
const logs = [
  {
    id: "l1",
    userId: "u1",
    action: "created a task",
    taskId: "t1",
    taskName: "Fix login redirect bug",
    date: "2026-06-10",
    time: "10:15",
  },
  {
    id: "l2",
    userId: "u3",
    action: "completed a task",
    taskId: "t2",
    taskName: "Design activity log table",
    date: "2026-06-09",
    time: "16:42",
  },
  {
    id: "l3",
    userId: "u1",
    action: "assigned a task",
    taskId: "t3",
    taskName: "Optimize dashboard queries",
    date: "2026-06-14",
    time: "08:05",
  },
  {
    id: "l4",
    userId: "u1",
    action: "edited a task",
    taskId: "t4",
    taskName: "Write onboarding checklist",
    date: "2026-06-15",
    time: "12:10",
  },
  {
    id: "l5",
    userId: "u3",
    action: "completed a task",
    taskId: "t6",
    taskName: "Add CSV export to logs",
    date: "2026-06-06",
    time: "18:05",
  },
  {
    id: "l6",
    userId: "u4",
    action: "started working on a task",
    taskId: "t3",
    taskName: "Optimize dashboard queries",
    date: "2026-06-14",
    time: "09:00",
  },
  {
    id: "l7",
    userId: "u1",
    action: "created a user",
    taskId: null,
    taskName: "Sneha Kulkarni",
    date: "2025-03-02",
    time: "09:00",
  },
  {
    id: "l8",
    userId: "u2",
    action: "logged in",
    taskId: null,
    taskName: "—",
    date: "2026-06-23",
    time: "08:50",
  },
];

export default logs;
