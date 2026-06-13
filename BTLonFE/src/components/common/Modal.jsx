import { useEffect, useRef } from "react";
import Button from "../ui/Button";
import { createPortal } from "react-dom";
import { CircleCheck, Info, TriangleAlert, X } from "lucide-react";

const icons = {
  info: <Info className="h-6 w-6 text-blue-600" />,
  warning: <TriangleAlert className="h-6 w-6 text-yellow-500" />,
  danger: <TriangleAlert className="h-6 w-6 text-red-600" />,
  success: <CircleCheck className="h-6 w-6 text-green-600" />,
};
const iconBg = {
  info: "bg-blue-50",
  warning: "bg-yellow-50",
  danger: "bg-red-50",
  success: "bg-green-50",
};

const confirmVariant = {
  info: "primary",
  warning: "primary",
  danger: "danger",
  success: "primary",
};

export default function Modal({
  open,
  onClose,
  onConfirm,
  intent = "info",
  title,
  description,
  confirmLabel = "Submit",
  cancelLabel = "Cancel",
  loading = false,
  closeOnOverlay = true,
  disableConfirm = false,
  children,
}) {
  const confirmRef = useRef(null);

  // Focus confirm button when modal is open
  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  // Close by press ESC
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock scroll body
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
        onClick={() => closeOnOverlay && !loading && onClose?.()}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-xl p-6 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${iconBg[intent]}`}
          >
            {icons[intent]}
          </div>
          {/* Title + description */}
          <div className="flex-1 min-w-0">
            {title && (
              <h2
                id="modal-title"
                className="text-base font-semibold text-gray-900"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>

          {/* Close X */}
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Children X */}
        {children && <div className="w-full mt-2">{children}</div>}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            ref={confirmRef}
            variant={confirmVariant[intent]}
            onClick={onConfirm}
            loading={loading}
            disabled={disableConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
