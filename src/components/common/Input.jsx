import { classNames } from "../../utils/helpers";

/**
 * Reusable form input designed to work directly with React Hook Form:
 *   <Input label="Email" type="email" error={errors.email?.message} {...register("email")} />
 *
 * Spreading {...register(...)} passes name/onChange/onBlur/ref straight through via `rest`.
 */
export default function Input({ label, error, icon, type = "text", className = "", ...rest }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-[var(--color-ink)]">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          className={classNames(
            "w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-ink)] outline-none transition-colors placeholder:text-slate-400",
            "focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]/20",
            error ? "border-[var(--color-danger)]" : "border-[var(--color-border)]",
            icon ? "pl-9" : "",
            className
          )}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}
