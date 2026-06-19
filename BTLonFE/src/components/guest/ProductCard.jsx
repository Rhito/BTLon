import formatPrice from "@/utils/helpers/formatPrice";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ProductCard({ product, showAddToCart = true }) {
  const { addToCart } = useCart();
  const toast = useToast();
  const [adding, setAdding] = useState(false);

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.sale_price / product.price) * 100)
    : null;
  const isOutOfStock = product.stock === 0;

  const imgSrc =
    product.images?.find((img) => img.is_main)?.thumbnail_url ?? null;

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // prevent navigation on button click
    setAdding(true);
    const result = await addToCart(product, 1);
    setAdding(false);
    result.success
      ? toast.success("Added to cart")
      : toast.error(result.message);
  };

  return (
    <div
      className="group relative bg-white rounded-xl border border-gray-100 overflow-hidden
      transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col"
    >
      {/* Image */}
      <a href={`/products/${product.slug}`} className="block">
        <div className="aspect-square bg-gray-50 overflow-hidden">
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-200">
              <svg
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
                />
              </svg>
            </div>
          )}
        </div>
      </a>

      {/* Badges */}
      {discountPct > 0 && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          -{discountPct}%
        </span>
      )}
      {isOutOfStock && (
        <span className="absolute top-2 right-2 bg-gray-800/70 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          Out of stock
        </span>
      )}
      {!isOutOfStock && product.stock <= 5 && (
        <span className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-xs font-medium px-2 py-0.5 rounded-full">
          Only {product.stock} left
        </span>
      )}

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="flex-1">
          <p className="text-xs text-gray-400 truncate">
            {product.categories?.[0]?.name ?? ""}
          </p>
          <a href={`/products/${product.slug}`}>
            <h3
              className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug mt-0.5
              hover:text-blue-600 transition-colors"
            >
              {product.name}
            </h3>
          </a>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-bold text-blue-600">
            {formatPrice(hasDiscount ? product.sale_price : product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
        {showAddToCart && (
          <Button
            size="sm"
            variant={isOutOfStock ? "secondary" : "primary"}
            disabled={isOutOfStock}
            loading={adding}
            fullWidth
            onClick={handleAddToCart}
          >
            {isOutOfStock ? "Out of stock" : "Add to cart"}
          </Button>
        )}
      </div>
    </div>
  );
}
