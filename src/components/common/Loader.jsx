/**
 * Reusable loading indicator.
 *   <Loader />                      -> small inline spinner
 *   <Loader label="Loading tasks" /> -> spinner + caption, used for full sections
 */
export default function Loader({ label, size = "md" }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-9 w-9" };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-[var(--color-ink-soft)]">
      <span
        className={`${sizes[size]} animate-spin rounded-full border-[3px] border-[var(--color-border)] border-t-[var(--color-primary)]`}
      />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}
