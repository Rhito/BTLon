import { useState } from "react";
import { useNavigate, Link, NavLink } from "react-router";
import { APP_NAME } from "@/config/app";
import { Search, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?filter=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-blue-600" : "text-gray-600 hover:text-gray-900"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="shrink-0 text-xl font-bold text-blue-600 tracking-tight"
          >
            {APP_NAME}
          </Link>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1 max-w-md items-center w-full"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product..."
                className="w-full rounded-md border border-gray-300 py-2 pl-4 pr-10 text-sm
                  focus:outline-none focus:ring-1 focus:ring-blue-200 focus:border-blue-500"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Nav + Cart */}
          <nav className="flex items-center gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
            <NavLink to="/track-order" className={navLinkClass}>
              Track Orders
            </NavLink>
            <CartIcon />
          </nav>
        </div>
      </div>
    </header>
  );
}

function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link
      to="/cart"
      className="relative text-gray-600 hover:text-blue-600 transition-colors"
      aria-label="Cart"
    >
      <ShoppingCart size={26} className="h-6 w-6" />
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-blue-600 text-white text-[10px] font-semibold flex items-center justify-center">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}
