import { Link } from "react-router";
export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100
        hover:border-blue-200 hover:shadow-md transition-all duration-200"
    >
      <div
        className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center
        group-hover:bg-blue-100 transition-colors"
      >
        <svg
          className="h-6 w-6 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
          />
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center">
        {category.name}
      </span>
    </Link>
  );
}
