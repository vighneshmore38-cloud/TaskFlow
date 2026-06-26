import { useEffect } from "react";
import { FiX } from "react-icons/fi";

/**
 * Reusable modal/dialog. Controlled entirely by the parent via `isOpen`:
 *   <Modal isOpen={open} onClose={() => setOpen(false)} title="Create user">
 *     ...form...
 *   </Modal>
 */
export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  // Closes on Escape, and locks page scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`animate-fade-in relative z-10 w-full ${widths[size]} max-h-[90vh] overflow-y-auto rounded-2xl bg-[var(--color-surface)] shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
