const variantClasses = {
  gray: "bg-gray-100 text-gray-700 ring-gray-300",
  blue: "bg-blue-50 text-blue-700 ring-blue-300",
  green: "bg-green-50 text-green-700 ring-green-300",
  yellow: "bg-yellow-50  text-yellow-700 ring-yellow-300",
  red: "bg-red-50 text-red-700 ring-red-300",
  purple: "bg-purple-50 text-purple-700 ring-purple-300",
  orange: "bg-orange-50 text-orange-700 ring-orange-300",
};
const sizeClasses = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-xs px-2.5 py-1 gap-1.5",
  lg: "text-sm px-3 py-1 gap-1.5",
};

const dotClasses = {
  gray: "bg-gray-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
};

// Preset status aliases
const statusPresets = {
  active: { variant: "green", label: "Active" },
  inactive: { variant: "gray", label: "Inactive" },
  pending: { variant: "yellow", label: "Pending" },
  error: { variant: "red", label: "Error" },
  banned: { variant: "red", label: "Banned" },
  draft: { variant: "gray", label: "Draft" },
  published: { variant: "green", label: "Published" },
  archived: { variant: "orange", label: "Archived" },
  review: { variant: "blue", label: "In Review" },
  paid: { variant: "green", label: "Paid" },
  unpaid: { variant: "red", label: "Unpaid" },
  refunded: { variant: "purple", label: "Refunded" },
};

// Badge
export default function Badge({
  children,
  variant = "gray",
  size = "md",
  status,
  dot = false,
  outline = false,
  className = "",
}) {
  // Resolve status preset
  const preset = status ? statusPresets[status] : null;
  const resolvedVariant = preset?.variant ?? variant;
  const resolvedLabel = preset?.label ?? children;

  return (
    <span
      className={[
        "inline-flex items-center rounded-full font-medium",
        outline
          ? `bg-transparent ring-1 ring-inset ${variantClasses[resolvedVariant].split(" ").slice(1).join(" ")}`
          : variantClasses[resolvedVariant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full shrink-0 ${dotClasses[resolvedVariant]}`}
          aria-hidden="true"
        />
      )}
      {resolvedLabel}
    </span>
  );
}
