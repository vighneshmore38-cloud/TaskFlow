import { FiInbox, FiAlertCircle } from "react-icons/fi";
import Button from "./Button";

/**
 * Shown when a list/table has no rows (e.g. no tasks assigned yet).
 * Per the design-writing guidance: an empty screen invites action,
 * it doesn't just state "no data".
 */
export function EmptyState({
  icon = <FiInbox className="h-7 w-7 text-slate-400" />,
  title = "Nothing here yet",
  description = "",
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-14 text-center">
      <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
        {icon}
      </div>
      <p className="font-display font-semibold text-[var(--color-ink)]">{title}</p>
      {description && <p className="max-w-sm text-sm text-[var(--color-ink-soft)]">{description}</p>}
      {actionLabel && (
        <Button className="mt-3" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * Shown when a fetch fails. States what happened and offers a retry,
 * in the interface's voice — never vague, never apologetic.
 */
export function ErrorState({ message = "Something went wrong while loading this data.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50/50 py-14 text-center">
      <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
        <FiAlertCircle className="h-7 w-7 text-[var(--color-danger)]" />
      </div>
      <p className="font-display font-semibold text-[var(--color-ink)]">Couldn't load this</p>
      <p className="max-w-sm text-sm text-[var(--color-ink-soft)]">{message}</p>
      {onRetry && (
        <Button className="mt-3" size="sm" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
