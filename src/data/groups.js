// Dummy "groups table" — mirrors what GET /api/groups would return.
// Users reference a group by id (groupId), the same FK pattern tasks
// use for assignedTo/createdBy.
const groups = [
  { id: "g1", name: "Developers", createdAt: "2025-01-12T09:00:00Z" },
  { id: "g2", name: "Designers", createdAt: "2025-01-12T09:00:00Z" },
  { id: "g3", name: "Marketing", createdAt: "2025-01-12T09:00:00Z" },
];

export default groups;
