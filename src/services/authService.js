import api from "./api";
import users from "../data/users";
import { mockDelay } from "../utils/helpers";

/**
 * Authenticates a user by email + password.
 *
 * CURRENT (dummy): checks against the local users.js array.
 * FUTURE BACKEND: replace the body with the commented Axios call below.
 * The expected response contract is documented so the swap is drop-in.
 */
export async function login({ email, password }) {
  // ---- Real backend call (uncomment when API exists) ----
  // const { data } = await api.post("/auth/login", { email, password });
  // Expected response: { user: { id, fullName, email, role }, token }
  // return data;

  // ---- Dummy implementation ----
  await mockDelay(null, 600); // simulate network latency

  const found = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!found) {
    const error = new Error("Invalid email or password");
    error.code = "INVALID_CREDENTIALS";
    throw error;
  }

  const { password: _omit, ...safeUser } = found;
  return { user: safeUser, token: `dummy-token-${found.id}` };
}

export default { login };
