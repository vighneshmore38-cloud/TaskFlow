import Modal from "../common/Modal";
import Badge from "../common/Badge";
import { getUserName, formatDate, formatDateTime } from "../../utils/helpers";
import { priorityBadge, statusBadge } from "../../utils/constants";

function Field({ label, children }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">{label}</p>
      <div className="mt-1 text-sm text-[var(--color-ink)]">{children}</div>
    </div>
  );
}

/** Read-only view used by both Admin (full detail) and User (read-only "All Tasks"). */
export default function TaskViewModal({ isOpen, onClose, task }) {
  if (!task) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} size="lg">
      <div className="grid grid-cols-2 gap-5">
        <Field label="Project">{task.projectName}</Field>
        <Field label="Type">{task.type}</Field>

        <Field label="Priority">
          <Badge text={task.priority} className={priorityBadge[task.priority]} />
        </Field>
        <Field label="Status">
          <Badge text={task.status} className={statusBadge[task.status]} />
        </Field>

        <Field label="Created By">{getUserName(task.createdBy)}</Field>
        <Field label="Assigned To">{getUserName(task.assignedTo)}</Field>

        <Field label="Created At">{formatDateTime(task.createdAt)}</Field>
        <Field label="Due">{formatDate(task.date)} at {task.time}</Field>

        <Field label="Completed At">{task.completedAt ? formatDateTime(task.completedAt) : "Not completed yet"}</Field>
        <Field label="Completed By">{task.completedBy ? getUserName(task.completedBy) : "—"}</Field>

        <div className="col-span-2">
          <Field label="Description">
            <p className="leading-relaxed text-[var(--color-ink-soft)]">{task.description}</p>
          </Field>
        </div>
      </div>
    </Modal>
  );
}
