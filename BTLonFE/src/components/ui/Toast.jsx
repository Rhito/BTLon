import { useCallback, useState } from "react";
import { ToastContext } from "@/contexts/ToastContext";
import { CircleCheck, CircleX, TriangleAlert, Info, X } from "lucide-react";
const icons = {
  success: <CircleCheck className="h-5 w-5 text-green-500 shrink-0" />,
  error: <CircleX className="h-5 w-5 text-red-500 shrink-0" />,
  warning: <TriangleAlert className="h-5 w-5 text-yellow-500 shrink-0" />,
  info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
};

const variantClasses = {
  success: "border-l-4 border-green-500",
  error: "border-l-4 border-red-500",
  warning: "border-l-4 border-yellow-500",
  info: "border-l-4 border-blue-500",
};

let _id = 0;

// Provider
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = "info", message, duration = 4000 }) => {
      const id = ++_id;
      setToasts((prev) => [...prev, { id, type, message }]);
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      {/* Portal-like fixed container */}
      <div
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={[
              "pointer-events-auto flex items-start gap-3 rounded-lg bg-white px-4 py-3 shadow-lg",
              "animate-in slide-in-from-right-4 fade-in duration-200",
              variantClasses[t.type],
            ].join(" ")}
          >
            {/* Icon */}
            {icons[t.type]}
            {/* Message */}
            <p className="flex-1 text-sm text-gray-700 pt-0.5">{t.message}</p>
            {/* Dismiss */}
            <button
              onClick={() => dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
              aria-label="close"
            >
              <X className="h-5 w-5 text-red-500 shrink-0" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
