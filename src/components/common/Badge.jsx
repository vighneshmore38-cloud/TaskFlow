import { classNames } from "../../utils/helpers";

/**
 * Small colored pill, e.g. <Badge text="High" className={priorityBadge.High} />
 * The actual color mapping lives in utils/constants.js so it's defined once.
 */
export default function Badge({ text, className = "" }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {text}
    </span>
  );
}
