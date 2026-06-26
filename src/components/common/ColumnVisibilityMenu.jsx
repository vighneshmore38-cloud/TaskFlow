import { useEffect, useRef, useState } from "react";
import { FiSliders, FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Toolbar button + dropdown listing every possible column with a toggle.
 * This is the ONLY way to bring back a column once it's hidden, since a
 * hidden column has no header on the board itself to click "show" on.
 *
 *   <ColumnVisibilityMenu
 *     columns={[{ id: "u2", name: "Priya Sharma" }, ...]}
 *     hiddenIds={prefs.hiddenIds}
 *     onToggle={prefs.toggleHidden}
 *     onShowAll={prefs.showAll}
 *   />
 */
export default function ColumnVisibilityMenu({ columns, hiddenIds, onToggle, onShowAll }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleCount = columns.length - hiddenIds.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-ink-soft)] hover:bg-slate-50"
      >
        <FiSliders className="h-4 w-4" />
        Columns
        {hiddenIds.length > 0 && (
          <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-xs font-semibold text-[var(--color-primary)]">
            {visibleCount}/{columns.length}
          </span>
        )}
      </button>

      {open && (
        <div className="animate-fade-in absolute right-0 z-30 mt-2 w-56 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-lg">
          <p className="px-2 py-1 text-xs font-medium uppercase tracking-wide text-[var(--color-ink-soft)]">
            Show / hide people
          </p>
          {columns.map((col) => {
            const hidden = hiddenIds.includes(col.id);
            return (
              <button
                key={col.id}
                onClick={() => onToggle(col.id)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50"
              >
                <span className={hidden ? "text-[var(--color-ink-soft)]" : "text-[var(--color-ink)]"}>
                  {col.name}
                </span>
                {hidden ? (
                  <FiEyeOff className="h-4 w-4 text-slate-400" />
                ) : (
                  <FiEye className="h-4 w-4 text-[var(--color-primary)]" />
                )}
              </button>
            );
          })}
          {hiddenIds.length > 0 && (
            <>
              <hr className="my-1 border-[var(--color-border)]" />
              <button
                onClick={onShowAll}
                className="w-full rounded-lg px-2 py-1.5 text-left text-sm font-medium text-[var(--color-primary)] hover:bg-indigo-50"
              >
                Show all
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
