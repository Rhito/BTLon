import { Link } from "react-router";
import { APP_NAME, APP_MAIL, APP_PHONE } from "@/config/app";
import { Mail, Phone, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <p className="text-lg font-bold text-blue-600">{APP_NAME}</p>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              A reputable electronics store. Fast delivery, good prices.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Category</p>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/products"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/track-order"
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Support</p>
            <ul className="space-y-2">
              <li className="text-sm text-gray-500 flex gap-2 items-center">
                <Mail size={16} className="shrink-0" /> {APP_MAIL}
              </li>
              <li className="text-sm text-gray-500 flex gap-2 items-center">
                <Phone size={16} className="shrink-0" /> {APP_PHONE}
              </li>
              <li className="text-sm text-gray-500 flex gap-2 items-center">
                <Clock size={16} className="shrink-0" /> 8:00 – 22:00 everyday
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
