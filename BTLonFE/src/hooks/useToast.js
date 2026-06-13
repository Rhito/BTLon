import { useContext } from "react";
import { ToastContext } from "@/contexts/ToastContext";

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast not in <ToastProvider>");

  const { toast, dismiss } = ctx;

  return {
    dismiss,
    success: (message, opts) => toast({ type: "success", message, ...opts }),
    error: (message, opts) => toast({ type: "error", message, ...opts }),
    warning: (message, opts) => toast({ type: "warning", message, ...opts }),
    info: (message, opts) => toast({ type: "info", message, ...opts }),
  };
}
