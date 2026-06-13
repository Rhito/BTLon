/**
 * @param {'sm'|'md'|'lg'|'xl'} size
 */
export default function Spinner({
  size = "md",
  className = "",
  label = "Loading...",
}) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
    xl: "h-6 w-6",
    xxl: "h-8 w-8",
  };

  return (
    <span role="status" aria-label={label} className="inline-flex items-center">
      <svg
        className={`animate-spin shrink-0 ${sizeClasses[size]} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
