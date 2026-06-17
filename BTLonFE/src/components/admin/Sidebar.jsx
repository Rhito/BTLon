import { NavLink, useNavigate } from "react-router";
import { APP_NAME } from "@/config/app";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import {
  LayoutDashboard,
  LayoutGrid,
  Package,
  ClipboardList,
  LogOut,
} from "lucide-react";

const navItems = [
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    Icon: LayoutDashboard,
    permission: "view_dashboard",
  },
  {
    to: "/admin/categories",
    label: "Categories",
    Icon: LayoutGrid,
    permission: "manage_categories",
  },
  {
    to: "/admin/products",
    label: "Products",
    Icon: Package,
    permission: "manage_products",
  },
  {
    to: "/admin/orders",
    label: "Orders",
    Icon: ClipboardList,
    permission: "manage_orders",
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const toast = useToast();
  const { logout, hasPermission } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout successfuly.");
    } catch {
      //
    } finally {
      navigate("/admin/login", { replace: true });
    }
  };

  const linkClass = ({ isActive }) =>
    [
      "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
    ].join(" ");

  return (
    <aside className="flex flex-col w-64 shrink-0 h-screen bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 shrink-0">
        <span className="text-lg font-bold text-blue-600 tracking-tight">
          {APP_NAME}
          <span className="ml-1.5 text-xs font-medium text-gray-400 tracking-normal">
            Admin
          </span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ to, label, Icon, permission }) => {
          if (permission && !hasPermission(permission)) return null;
          return (
            <NavLink key={to} to={to} className={linkClass}>
              <Icon className="h-5 w-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-gray-200 shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-sm font-medium
            text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
