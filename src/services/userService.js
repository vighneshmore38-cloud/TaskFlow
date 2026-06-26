import api from "./api";
import seedUsers from "../data/users";
import { mockDelay } from "../utils/helpers";

// IMPORTANT: this points at the SAME array `data/users.js` exports — no
// `[...seedUsers]` copy. JS modules are singletons, so any other file that
// imports that array (like utils/helpers.js's getUserName) sees the same
// object. As long as we mutate it IN PLACE (push/splice), instead of
// reassigning a brand new array, every part of the app that looks up a
// user by id stays correct without needing to be told about the change.
let usersStore = seedUsers;
let nextId = usersStore.length + 1;

export async function getUsers() {
  // ---- Real backend call ----
  // const { data } = await api.get("/users");
  // return data;

  const safe = usersStore.map(({ password: _pw, ...rest }) => rest);
  return mockDelay(safe, 500);
}

export async function createUser(payload) {
  // ---- Real backend call ----
  // const { data } = await api.post("/users", payload);
  // return data;

  const newUser = {
    id: `u${nextId++}`,
    fullName: payload.fullName,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    groupId: payload.groupId || null,
    createdAt: new Date().toISOString(),
  };
  usersStore.push(newUser); // mutate in place — see note above
  const { password: _pw2, ...safe } = newUser;
  return mockDelay(safe, 500);
}

export async function updateUser(id, payload) {
  // ---- Real backend call ----
  // const { data } = await api.put(`/users/${id}`, payload);
  // return data;

  const index = usersStore.findIndex((u) => u.id === id);
  if (index !== -1) {
    usersStore[index] = { ...usersStore[index], ...payload };
  }
  const { password: _pw3, ...safe } = usersStore[index];
  return mockDelay(safe, 500);
}

export async function deleteUser(id) {
  // ---- Real backend call ----
  // await api.delete(`/users/${id}`);
  // return { id };

  const index = usersStore.findIndex((u) => u.id === id);
  if (index !== -1) usersStore.splice(index, 1);
  return mockDelay({ id }, 400);
}

export default { getUsers, createUser, updateUser, deleteUser };
