import { useEffect, useState } from "react";

const PREFIX = "taskflow_board_prefs_";

function loadPrefs(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return { order: [], hidden: [] };
    const parsed = JSON.parse(raw);
    return { order: parsed.order || [], hidden: parsed.hidden || [] };
  } catch {
    return { order: [], hidden: [] };
  }
}

/**
 * Remembers, PER LOGGED-IN PERSON, which user-columns are hidden and what
 * order they appear in on a task board — this is what makes "I hide a
 * column" or "I move a column to the front" a personal preference rather
 * than something that changes what anyone else sees.
 *
 * Saved to localStorage under a key scoped to `viewerId` (the CURRENT
 * user's id, from useAuth()) — so an admin's layout and a user's layout
 * never collide, and two different user accounts don't collide either.
 *
 *   const prefs = useBoardPreferences(currentUser.id, allColumnIds);
 *   prefs.orderedIds   // every column id, in this person's chosen order
 *   prefs.hiddenIds    // which ids this person has hidden
 *   prefs.toggleHidden(id)
 *   prefs.moveToFront(id)
 *   prefs.moveToBack(id)
 *   prefs.showAll()
 */
export function useBoardPreferences(viewerId, allColumnIds) {
  const storageKey = `${PREFIX}${viewerId}`;
  const [prefs, setPrefs] = useState(() => loadPrefs(storageKey));

  // If the set of possible columns changes (e.g. an admin creates a new
  // user, so a new column id appears), give that id a place in `order`
  // by appending it at the end — so new columns just show up naturally
  // instead of being invisible until you happen to touch this hook again.
  useEffect(() => {
    setPrefs((prev) => {
      const missing = allColumnIds.filter((id) => !prev.order.includes(id));
      if (missing.length === 0) return prev;
      return { ...prev, order: [...prev.order, ...missing] };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allColumnIds.join(",")]);

  // Persist on every change.
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(prefs));
  }, [prefs, storageKey]);

  function toggleHidden(id) {
    setPrefs((prev) => ({
      ...prev,
      hidden: prev.hidden.includes(id)
        ? prev.hidden.filter((h) => h !== id)
        : [...prev.hidden, id],
    }));
  }

  function moveToFront(id) {
    setPrefs((prev) => ({ ...prev, order: [id, ...prev.order.filter((x) => x !== id)] }));
  }

  function moveToBack(id) {
    setPrefs((prev) => ({ ...prev, order: [...prev.order.filter((x) => x !== id), id] }));
  }

  function showAll() {
    setPrefs((prev) => ({ ...prev, hidden: [] }));
  }

  // Defensive fallback: include any id that — for whatever reason — isn't
  // in `order` yet (e.g. the effect above hasn't committed this render).
  const orderedIds = prefs.order.filter((id) => allColumnIds.includes(id));
  for (const id of allColumnIds) {
    if (!orderedIds.includes(id)) orderedIds.push(id);
  }

  return {
    orderedIds,
    hiddenIds: prefs.hidden,
    toggleHidden,
    moveToFront,
    moveToBack,
    showAll,
  };
}
