import { FiChevronsLeft, FiChevronsRight, FiEyeOff } from "react-icons/fi";
import TaskCard from "./TaskCard";
import MovableList from "./MovableList";
import { getInitials } from "../../utils/helpers";

/**
 * Groups tasks into one vertical column per user — a board where the
 * columns are "who", not "what stage" (unlike a typical Kanban board).
 * Lets you see one person's whole workload at a glance, side by side
 * with everyone else's.
 *
 *   <TaskBoard
 *     groups={groupTasksByUser(tasks, users)}
 *     onView={setViewingTask}
 *     renderActions={(task) => <button>...</button>}   // optional
 *     getMetaLabel={(task) => `Created by ${getUserName(task.createdBy)}`} // optional
 *     onMoveToFront={(userId) => ...}  // optional — adds a "move to front" button
 *     onMoveToBack={(userId) => ...}   // optional — adds a "move to back" button
 *     onHide={(userId) => ...}         // optional — adds a "hide this column" button
 *   />
 *
 * `groups` must already be sorted/filtered into the order you want shown —
 * this component only renders columns, it doesn't decide layout itself.
 */
export default function TaskBoard({
  groups,
  onView,
  renderActions,
  getMetaLabel,
  onMoveToFront,
  onMoveToBack,
  onHide,
  emptyColumnLabel = "Nothing here",
}) {
  const showColumnControls = onMoveToFront || onMoveToBack || onHide;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {groups.map((group) => (
        <div
          key={group.userId}
          className="flex w-80 shrink-0 flex-col gap-3 rounded-2xl bg-[var(--color-surface-soft)] p-3"
        >
          {/* Column header: this is the only place the user's name appears,
              so individual cards inside don't need to repeat "Assigned to X". */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-[var(--color-primary)]">
                {getInitials(group.userName)}
              </span>
              <span className="font-display text-sm font-semibold text-[var(--color-ink)]">
                {group.userName}
              </span>
              <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-xs font-medium text-[var(--color-ink-soft)]">
                {group.tasks.length}
              </span>
            </div>

            {showColumnControls && (
              <div className="flex items-center gap-0.5">
                {onMoveToFront && (
                  <button
                    onClick={() => onMoveToFront(group.userId)}
                    className="rounded-md p-1.5 text-[var(--color-ink-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                    title={`Move ${group.userName}'s column to the front`}
                    aria-label={`Move ${group.userName}'s column to the front`}
                  >
                    <FiChevronsLeft className="h-4 w-4" />
                  </button>
                )}
                {onMoveToBack && (
                  <button
                    onClick={() => onMoveToBack(group.userId)}
                    className="rounded-md p-1.5 text-[var(--color-ink-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
                    title={`Move ${group.userName}'s column to the back`}
                    aria-label={`Move ${group.userName}'s column to the back`}
                  >
                    <FiChevronsRight className="h-4 w-4" />
                  </button>
                )}
                {onHide && (
                  <button
                    onClick={() => onHide(group.userId)}
                    className="rounded-md p-1.5 text-[var(--color-ink-soft)] hover:bg-[var(--color-surface)] hover:text-[var(--color-danger)]"
                    title={`Hide ${group.userName}'s column`}
                    aria-label={`Hide ${group.userName}'s column`}
                  >
                    <FiEyeOff className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          {group.tasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/50 py-8 text-center text-xs text-[var(--color-ink-soft)]">
              {emptyColumnLabel}
            </div>
          ) : (
            <MovableList
              items={group.tasks}
              getKey={(task) => task.id}
              className="flex flex-col gap-3"
              renderItem={(task) => (
                <TaskCard
                  task={task}
                  onView={onView}
                  metaLabel={getMetaLabel ? getMetaLabel(task) : undefined}
                  actions={renderActions ? renderActions(task) : null}
                />
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
