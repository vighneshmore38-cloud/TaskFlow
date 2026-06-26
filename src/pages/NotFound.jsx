import { Link } from "react-router-dom";
import { FiAlertTriangle } from "react-icons/fi";
import Button from "../components/common/Button";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[var(--color-bg)] px-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
        <FiAlertTriangle className="h-7 w-7 text-[var(--color-warning)]" />
      </span>
      <h1 className="font-display text-2xl font-bold text-[var(--color-ink)]">Page not found</h1>
      <p className="max-w-sm text-sm text-[var(--color-ink-soft)]">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/">
        <Button className="mt-2">Back to safety</Button>
      </Link>
    </div>
  );
}
