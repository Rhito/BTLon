import Spinner from "./Spinner";

/**
 * LoadingOverlay — 3 dạng sử dụng:
 *
 * 1. fullscreen  — che toàn màn hình (page transition, login submit)
 * 2. relative    — che 1 container cụ thể (table, form, card)
 * 3. inline      — spinner + text nằm trong flow (skeleton thay thế content)
 */

//1. Fullscreen overlay
export function FullscreenLoader({ message = "Loading..." }) {
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
      aria-live="polite"
      aria-label={message}
    >
      <Spinner size="xxl" className="text-blue-600" />
      {message && <p className="mt-3 text-sm text-gray-500">{message}</p>}
    </div>
  );
}

// 2. Container overlay (relative parent)
export function LoadingOverlay({
  show,
  message,
  spinnerSize = "md",
  className = "",
}) {
  if (!show) return null;

  return (
    <div
      className={`absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] ${className}`}
      aria-live="polite"
    >
      <Spinner size={spinnerSize} className="text-blue-600" />
      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}
    </div>
  );
}

// 3. Inner loader
export function InlineLoader({ message = "Loading...", size = "md" }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
      <Spinner size={size} />
      <span className="text-sm">{message}</span>
    </div>
  );
}

export default LoadingOverlay;
