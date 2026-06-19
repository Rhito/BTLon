import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { CheckCircle, Copy, Check } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();
  const [copied, setCopied] = useState(false);
  const cleared = useRef(false);

  const orderCode = location.state?.order_code ?? "—";
  const customerEmail = location.state?.customer_email ?? "";

  // Clear cart once on mount
  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  // Redirect if no order code (direct access)
  useEffect(() => {
    if (!location.state?.order_code) navigate("/", { replace: true });
  }, [location.state, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto py-16 text-center">
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div
          className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center
          animate-[scale-in_0.3s_ease-out]"
        >
          <CheckCircle className="h-10 w-10 text-green-500" strokeWidth={1.5} />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
      <p className="text-gray-500 text-sm mb-8">
        Thank you for your order. We'll process it right away.
      </p>

      {/* Order code */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-5 mb-4">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-2">
          Order Code
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl font-bold text-gray-900 tracking-widest font-mono">
            {orderCode}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            aria-label="Copy order code"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-400 mb-8">
        Save your order code and the email used at checkout — you'll need them
        to track your order.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button
          onClick={() =>
            navigate("/track-order", {
              state: {
                order_code: orderCode,
                customer_email: customerEmail,
              },
            })
          }
        >
          Track My Order
        </Button>
        <Button variant="ghost" onClick={() => navigate("/products")}>
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
