/**
 * Reusable hover tooltip.
 *
 * HOW IT WORKS (no JS needed, pure CSS):
 *   - The wrapper div gets Tailwind's `group` class.
 *   - The tooltip itself starts as `invisible opacity-0` (present in the DOM,
 *     but not shown — this matters: we want it to fade, not pop, so we
 *     don't use `hidden`, which can't be transitioned).
 *   - `group-hover:visible group-hover:opacity-100` says: "when the PARENT
 *     with class `group` is hovered, make THIS element visible."
 *     That parent-child hover relationship is the whole trick.
 *
 * Usage:
 *   <Tooltip content="Full description text...">
 *     <p className="line-clamp-2">Full description text...</p>
 *   </Tooltip>
 */
export default function Tooltip({ content, children, className = "" }) {
  if (!content) return children;

  return (
    <div className={`group relative ${className}`}>
      {children}
      <div
        className="invisible absolute left-0 top-full z-20 mt-2 w-72 -translate-y-1 rounded-lg bg-[var(--color-ink)] px-3 py-2 text-xs leading-relaxed text-white opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100"
        role="tooltip"
      >
        {content}
        {/* little triangle pointer */}
        <span className="absolute -top-1 left-4 h-2 w-2 rotate-45 bg-[var(--color-ink)]" />
      </div>
    </div>
  );
}
