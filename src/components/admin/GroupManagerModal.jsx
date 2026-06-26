import { useState } from "react";
import { FiTrash2, FiPlus, FiUsers } from "react-icons/fi";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Input from "../common/Input";

/**
 * Lets an admin view every group, add a new one, and request deletion of
 * an existing one (the actual delete is confirmed one level up, in
 * pages/admin/Users.jsx, via the same ConfirmDialog pattern used for
 * users/tasks elsewhere in the app — kept consistent on purpose).
 */
export default function GroupManagerModal({ isOpen, onClose, groups, onCreate, onRequestDelete, isSaving }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  function handleAdd() {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Group name can't be empty");
      return;
    }
    if (groups.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) {
      setError("A group with this name already exists");
      return;
    }
    setError("");
    onCreate(trimmed);
    setName("");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage groups" size="sm">
      <div className="flex flex-col gap-5">
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
            Existing groups
          </p>
          {groups.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--color-border)] py-6 text-center text-sm text-[var(--color-ink-soft)]">
              No groups yet — create one below.
            </p>
          ) : (
            <ul className="flex flex-col gap-1.5">
              {groups.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-border)] px-3 py-2"
                >
                  <span className="flex items-center gap-2 text-sm text-[var(--color-ink)]">
                    <FiUsers className="h-4 w-4 text-[var(--color-ink-soft)]" />
                    {g.name}
                  </span>
                  <button
                    onClick={() => onRequestDelete(g)}
                    className="rounded-md p-1.5 text-[var(--color-ink-soft)] hover:bg-red-50 hover:text-[var(--color-danger)]"
                    aria-label={`Delete ${g.name}`}
                    title="Delete group"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
            Add a new group
          </p>
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                placeholder="e.g. Developers"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                error={error}
              />
            </div>
            <Button icon={<FiPlus className="h-4 w-4" />} onClick={handleAdd} isLoading={isSaving}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
