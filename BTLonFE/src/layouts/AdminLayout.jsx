import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/categories": "Categories",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
};

export default function AdminLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const title =
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ??
    "Admin";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar title={title} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
