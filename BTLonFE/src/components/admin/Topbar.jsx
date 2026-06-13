import authService from "@/services/authService";

export default function Topbar({ title = "" }) {
  const { name, email } = authService.getAdminInfo();

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shrink-0">
      {/* Page title */}
      <h1 className="text-base font-semibold text-gray-800">{title}</h1>

      {/* Admin info */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800 leading-tight">
            {name}
          </p>
          {email && (
            <p className="text-xs text-gray-400 leading-tight">{email}</p>
          )}
        </div>

        {/* Avatar */}
        <div className="h-9 w-9 rounded-full bg-blue-600 text-white text-sm font-semibold flex items-center justify-center shrink-0 select-none">
          {initials}
        </div>
      </div>
    </header>
  );
}
