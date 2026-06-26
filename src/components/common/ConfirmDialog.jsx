import Modal from "./Modal";
import Button from "./Button";
import { FiAlertTriangle } from "react-icons/fi";

/**
 * Thin wrapper around Modal for "are you sure?" confirmations
 * (used by Delete User / Delete Task actions).
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description,
  confirmLabel = "Delete",
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50">
          <FiAlertTriangle className="h-5 w-5 text-[var(--color-danger)]" />
        </div>
        <p className="text-sm text-[var(--color-ink-soft)]">{description}</p>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
