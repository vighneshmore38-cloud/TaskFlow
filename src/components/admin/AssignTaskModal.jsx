import { useState, useEffect } from "react";
import Modal from "../common/Modal";
import Select from "../common/Select";
import Button from "../common/Button";

/**
 * Dedicated "Assign Task" action — deliberately separate from the full
 * edit form, since reassigning a task is a much more common, lighter action.
 */
export default function AssignTaskModal({ isOpen, onClose, onAssign, task, users, isSaving }) {
  const [assignedTo, setAssignedTo] = useState("");

  useEffect(() => {
    if (isOpen && task) setAssignedTo(task.assignedTo || "");
  }, [isOpen, task]);

  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Assign "${task.title}"`} size="sm">
      <div className="flex flex-col gap-4">
        <Select label="Assign to" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
          <option value="">Select a user</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.fullName}
            </option>
          ))}
        </Select>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            isLoading={isSaving}
            disabled={!assignedTo}
            onClick={() => onAssign(task.id, assignedTo)}
          >
            Assign
          </Button>
        </div>
      </div>
    </Modal>
  );
}
