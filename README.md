# TaskFlow — Role Based To-Do Management System (Frontend)

A complete, production-styled **frontend-only** React application for a role-based
task management system, built with Vite, Tailwind CSS, React Router DOM, Context API,
React Hook Form + Yup, TanStack React Table, React Icons, and File Saver.

There is **no backend** — all data lives in `src/data/*.js` and is served through an
in-memory service layer (`src/services/*.js`) designed to be swapped for real API
calls with minimal changes.

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## Demo credentials

| Role  | Email                | Password   |
|-------|-----------------------|------------|
| Admin | admin@taskflow.com    | Admin@123  |
| User  | priya@taskflow.com    | User@123   |
| User  | rohan@taskflow.com    | User@123   |
| User  | sneha@taskflow.com    | User@123   |
| User  | vikram@taskflow.com   | User@123   |

There is no registration page — only an admin account can create new users
(Admin -> Users -> Create user).

## Project structure

```
src/
├── components/
│   ├── common/     Reusable UI: Button, Input, Select, Modal, ConfirmDialog,
│   │               Card, Table, Loader, Badge, EmptyState/ErrorState, TaskViewModal
│   ├── layout/     Navbar, Sidebar (role-aware navigation)
│   ├── admin/      Admin-only pieces: UserFormModal, TaskFormModal, AssignTaskModal
│   └── user/       (reserved for user-only composite components)
├── layouts/        AdminLayout, UserLayout (sidebar + navbar shells)
├── pages/
│   ├── admin/      Dashboard, Users, Tasks, Logs
│   ├── user/       Dashboard, Tasks, AllTasks
│   ├── Login.jsx
│   └── NotFound.jsx
├── routes/         AppRoutes, ProtectedRoute (RBAC guard), RoleRedirect
├── context/        AuthContext (session/role), ToastContext (notifications)
├── services/       api.js (Axios instance) + authService/userService/taskService/logService
├── utils/          constants.js, helpers.js, validationSchemas.js (Yup)
└── data/           users.js, tasks.js, logs.js — dummy datasets
```

## Connecting a real backend

Every function in `src/services/*.js` already contains the real Axios call,
commented out directly above the dummy implementation, with the expected
request/response shape documented. To go live:

1. Create a `.env` file with `VITE_API_BASE_URL=https://your-api.com/api`.
2. In each service file, delete the dummy logic block and uncomment the Axios call.
3. Make sure your backend's JSON shape matches what's documented in the comments
   (e.g. login returns `{ user: { id, fullName, email, role }, token }`).

No component, page, or context needs to change — they only ever call the
service functions (`getTasks()`, `createUser()`, etc.), never Axios directly.

## Role-based access control

- `ProtectedRoute` (in `src/routes/ProtectedRoute.jsx`) redirects unauthenticated
  visitors to `/login`, and redirects authenticated users with the wrong role to
  their own dashboard.
- User-only pages (`pages/user/*`) never import the create/edit/delete/assign
  components — the capability doesn't exist in that part of the bundle, it isn't
  just hidden by a conditional.
