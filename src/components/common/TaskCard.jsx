import { FiUser, FiCalendar, FiFolder } from "react-icons/fi";
import Badge from "./Badge";
import Tooltip from "./Tooltip";
import { priorityBadge, statusBadge, statusRail } from "../../utils/constants";
import { getUserName, formatDate } from "../../utils/helpers";

/**
 * One task, rendered as a card instead of a table row.
 *
 * - `onView`   : called when the card itself is clicked (opens the detail modal)
 * - `actions`  : optional JSX (buttons) rendered in the footer — e.g. Edit/Delete
 *                for admin, or "Mark complete" for a user. Kept as a prop so
 *                THIS component doesn't need to know who's allowed to do what;
 *                each page decides that and passes only the buttons it wants.
 * - `metaLabel`: small text above the title, e.g. "Assigned to Priya Sharma"
 */
export default function TaskCard({ task, onView, actions, metaLabel }) {
  return (
    <div
      onClick={() => onView?.(task)}
      className={`group cursor-pointer rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-sm transition-shadow hover:shadow-md ${statusRail[task.status]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display font-semibold text-[var(--color-ink)]">{task.title}</p>
          {metaLabel && <p className="mt-0.5 text-xs text-[var(--color-ink-soft)]">{metaLabel}</p>}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Badge text={task.priority} className={priorityBadge[task.priority]} />
          <Badge text={task.status} className={statusBadge[task.status]} />
        </div>
      </div>

      {/* Truncated description + hover tooltip with the full text.
          line-clamp-2 is the pure-CSS ellipsis: cuts after 2 lines, adds "...". */}
      <Tooltip content={task.description} className="mt-2 block">
        <p className="line-clamp-2 text-sm text-[var(--color-ink-soft)]">{task.description}</p>
      </Tooltip>

      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[var(--color-ink-soft)]">
        <span className="flex items-center gap-1">
          <FiFolder className="h-3.5 w-3.5" /> {task.projectName}
        </span>
        <span className="flex items-center gap-1">
          <FiUser className="h-3.5 w-3.5" /> {getUserName(task.assignedTo)}
        </span>
        <span className="flex items-center gap-1">
          <FiCalendar className="h-3.5 w-3.5" /> {formatDate(task.date)}
        </span>
      </div>

      {actions && (
        // stopPropagation: clicking a button in here must NOT also fire
        // the card's onView click — see explanation above this component.
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex justify-end gap-1.5 border-t border-[var(--color-border)] pt-3"
        >
          {actions}
        </div>
      )}
    </div>
  );
}
