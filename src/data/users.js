// Dummy "users table". In a real backend this would come from
// GET /api/users and passwords would never be sent to the client.
// Kept here only so the demo login can validate credentials locally.
const users = [
  {
    id: "u1",
    fullName: "Aarav Mehta",
    email: "admin@taskflow.com",
    password: "Admin@123",
    role: "admin",
    groupId: null,
    createdAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "u2",
    fullName: "Priya Sharma",
    email: "priya@taskflow.com",
    password: "User@123",
    role: "user",
    groupId: "g1",
    createdAt: "2025-02-04T09:00:00Z",
  },
  {
    id: "u3",
    fullName: "Rohan Iyer",
    email: "rohan@taskflow.com",
    password: "User@123",
    role: "user",
    groupId: "g1",
    createdAt: "2025-02-11T09:00:00Z",
  },
  {
    id: "u4",
    fullName: "Sneha Kulkarni",
    email: "sneha@taskflow.com",
    password: "User@123",
    role: "user",
    groupId: "g2",
    createdAt: "2025-03-02T09:00:00Z",
  },
  {
    id: "u5",
    fullName: "Vikram Nair",
    email: "vikram@taskflow.com",
    password: "User@123",
    role: "user",
    groupId: "g3",
    createdAt: "2025-03-20T09:00:00Z",
  },
];

export default users;
