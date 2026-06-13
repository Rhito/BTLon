import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <p className="text-8xl font-bold text-blue-600">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-gray-900">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        The address you are trying to access is unavailable or has been deleted.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="mt-8 text-sm text-blue-600 hover:underline"
      >
        ← Return to previous page
      </button>
    </div>
  );
}
