import { classNames } from "../../utils/helpers";

const VARIANTS = {
  primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]",
  secondary:
    "bg-[var(--color-surface)] text-[var(--color-ink)] border border-[var(--color-border)] hover:bg-slate-50",
  danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
  ghost: "bg-transparent text-[var(--color-ink-soft)] hover:bg-slate-100",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

/**
 * Reusable button. Any page can do:
 *   <Button variant="danger" icon={<FiTrash2 />} onClick={...}>Delete</Button>
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  isLoading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classNames(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon && iconPosition === "left" && icon
      )}
      {children}
      {!isLoading && icon && iconPosition === "right" && icon}
    </button>
  );
}
