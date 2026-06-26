import api from "./api";
import seedGroups from "../data/groups";
import { mockDelay } from "../utils/helpers";

// Same reasoning as userService.js: keep the SAME array reference
// `data/groups.js` exports, and mutate it in place, so utils/helpers.js's
// getGroupName() stays correct without needing its own copy of this data.
let groupsStore = seedGroups;
let nextId = groupsStore.length + 1;

export async function getGroups() {
  // ---- Real backend call ----
  // const { data } = await api.get("/groups");
  // return data;

  return mockDelay([...groupsStore], 400);
}

export async function createGroup(name) {
  // ---- Real backend call ----
  // const { data } = await api.post("/groups", { name });
  // return data;

  const newGroup = {
    id: `g${nextId++}`,
    name: name.trim(),
    createdAt: new Date().toISOString(),
  };
  groupsStore.push(newGroup);
  return mockDelay(newGroup, 400);
}

export async function deleteGroup(id) {
  // ---- Real backend call ----
  // await api.delete(`/groups/${id}`);
  // return { id };

  // NOTE: this does NOT clear groupId off users who belonged to this
  // group — they'll just show "Unknown group" until reassigned. A real
  // backend would likely either block deletion while members exist, or
  // cascade-clear the field; left as a deliberate simplification here.
  const index = groupsStore.findIndex((g) => g.id === id);
  if (index !== -1) groupsStore.splice(index, 1);
  return mockDelay({ id }, 300);
}

export default { getGroups, createGroup, deleteGroup };
