import { classNames } from "../../utils/helpers";

/**
 * Dashboard summary card:
 *   <Card label="Total Tasks" value={42} icon={<FiList />} accent="primary" />
 */
const ACCENTS = {
  primary: "bg-indigo-50 text-[var(--color-primary)]",
  success: "bg-emerald-50 text-[var(--color-success)]",
  warning: "bg-amber-50 text-[var(--color-warning)]",
  accent: "bg-orange-50 text-[var(--color-accent)]",
};

export default function Card({ label, value, icon, accent = "primary", className = "" }) {
  return (
    <div
      className={classNames(
        "flex items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm",
        className
      )}
    >
      <div className={classNames("flex h-12 w-12 items-center justify-center rounded-xl text-xl", ACCENTS[accent])}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-[var(--color-ink-soft)]">{label}</p>
        <p className="font-display text-2xl font-bold text-[var(--color-ink)]">{value}</p>
      </div>
    </div>
  );
}
