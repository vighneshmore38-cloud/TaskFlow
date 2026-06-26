import * as yup from "yup";

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .required("Email is required")
    .email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// Used by the Admin "Create / Edit user" form.
// `isEdit` relaxes the password rule so editing a user doesn't force a reset.
export function getUserSchema(isEdit = false) {
  return yup.object({
    fullName: yup
      .string()
      .trim()
      .required("Full name is required")
      .min(2, "Full name is too short"),
    email: yup.string().trim().required("Email is required").email("Enter a valid email address"),
    password: isEdit
      ? yup.string().transform((v) => (v ? v : undefined)).min(6, "Password must be at least 6 characters")
      : yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
    role: yup.string().required("Role is required").oneOf(["admin", "user"], "Choose a valid role"),
    // Optional on purpose: not every user needs to belong to a group,
    // and "" (the <select>'s "No group" option) must be a valid value,
    // not something yup rejects as missing.
    groupId: yup.string().optional(),
  });
}

// Used by the Admin "Create / Edit task" form.
export const taskSchema = yup.object({
  title: yup.string().trim().required("Title is required").min(3, "Title is too short"),
  description: yup.string().trim().required("Description is required"),
  projectName: yup.string().trim().required("Project name is required"),
  priority: yup
    .string()
    .required("Priority is required")
    .oneOf(["Low", "Medium", "High", "Critical"]),
  type: yup
    .string()
    .required("Type is required")
    .oneOf(["Bug", "Feature", "Improvement", "General"]),
  date: yup.string().required("Due date is required"),
  time: yup.string().required("Due time is required"),
  assignedTo: yup.string().required("Please assign this task to a user"),
});

// Used by a USER creating a task for themselves. Deliberately a SMALLER
// schema than taskSchema above — no `assignedTo` field exists at all,
// because a user creating their own task is always assigned to themselves;
// that value is set in code (see Tasks.jsx), not chosen in the form.
export const selfTaskSchema = yup.object({
  title: yup.string().trim().required("Title is required").min(3, "Title is too short"),
  description: yup.string().trim().required("Description is required"),
  projectName: yup.string().trim().required("Project name is required"),
  priority: yup
    .string()
    .required("Priority is required")
    .oneOf(["Low", "Medium", "High", "Critical"]),
  type: yup
    .string()
    .required("Type is required")
    .oneOf(["Bug", "Feature", "Improvement", "General"]),
  date: yup.string().required("Due date is required"),
  time: yup.string().required("Due time is required"),
});
