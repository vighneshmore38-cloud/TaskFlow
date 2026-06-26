import { classNames } from "../../utils/helpers";

/**
 * Reusable select, same RHF-friendly pattern as Input:
 *   <Select label="Role" error={errors.role?.message} {...register("role")}>
 *     <option value="user">User</option>
 *   </Select>
 */
export default function Select({ label, error, children, className = "", ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--color-ink)]">{label}</label>
      )}
      <select
        className={classNames(
          "w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none transition-colors",
          "focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]/20",
          error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
          className
        )}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
