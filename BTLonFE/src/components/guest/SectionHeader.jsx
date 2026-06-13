import { Link } from "react-router";
export default function SectionHeader({
  title,
  subtitle,
  linkTo,
  linkLabel,
  className,
}) {
  return (
    <div className={`flex items-end justify-between mb-6 ${className}`}>
      <div>
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}
