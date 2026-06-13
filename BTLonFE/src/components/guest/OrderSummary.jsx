import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import formatPrice from "@/utils/helpers/formatPrice";

export default function OrderSummary() {
  const { items, cartTotal } = useCart();

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">
        Order Summary ({items.length} {items.length === 1 ? "item" : "items"})
      </h2>

      <ul className="space-y-3 mb-4">
        {items.map(({ product, quantity }) => {
          const price = product.sale_price ?? product.price;
          const imgSrc =
            product.images?.find((img) => img.is_main)?.thumbnail_url ?? null;

          return (
            <li key={product.id} className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-gray-50 overflow-hidden shrink-0">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-200">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 line-clamp-1">
                  {product.name}
                </p>
                <p className="text-xs text-gray-400">×{quantity}</p>
              </div>
              <span className="text-sm font-medium text-gray-700 shrink-0">
                {formatPrice(price * quantity)}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>Shipping</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900 text-base">
          <span>Total</span>
          <span className="text-blue-600">{formatPrice(cartTotal)}</span>
        </div>
      </div>
    </div>
  );
}
