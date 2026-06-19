import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import Modal from "@/components/common/Modal";
import EmptyState from "@/components/ui/EmptyState";
import formatPrice from "@/utils/helpers/formatPrice";

// ─── Quantity input ──

function QuantityInput({ value, max, onChange }) {
  return (
    <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        className="h-8 w-8 flex items-center justify-center text-gray-500
          hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>

      <input
        type="number"
        min={1}
        max={max}
        value={value}
        name="quantity"
        onChange={(e) => {
          const val = Number(e.target.value);
          if (!isNaN(val)) onChange(Math.min(Math.max(1, val), max));
        }}
        className="h-8 w-10 text-center text-sm font-medium border-x border-gray-200
          focus:outline-none focus:ring-0 bg-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
    [&::-webkit-inner-spin-button]:appearance-none"
      />

      <button
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className="h-8 w-8 flex items-center justify-center text-gray-500
          hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ─── Cart row (desktop table row) ──

function CartRow({ item, onRemove }) {
  const { updateQuantity } = useCart();
  const { product, quantity } = item;

  const price = product.sale_price ?? product.price;
  const subtotal = price * quantity;

  const imgSrc =
    product.images?.find((img) => img.is_main)?.thumbnail_url ?? null;

  return (
    <tr className="border-b border-gray-100 last:border-0">
      {/* Product */}
      <td className="py-4 pr-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-lg bg-gray-50 overflow-hidden shrink-0">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-200">
                <ShoppingBag className="h-6 w-6" />
              </div>
            )}
          </div>
          <div>
            <Link
              to={`/products/${product.slug}`}
              className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
            >
              {product.name}
            </Link>
            <p className="text-xs text-gray-400 mt-0.5">
              {product.categories?.[0]?.name ?? ""}
            </p>
          </div>
        </div>
      </td>

      {/* Unit price */}
      <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap">
        {formatPrice(price)}
      </td>

      {/* Quantity */}
      <td className="py-4 px-4">
        <QuantityInput
          value={quantity}
          max={product.stock}
          onChange={(val) => updateQuantity(product.id, val)}
        />
        {product.stock <= 5 && (
          <p className="text-xs text-orange-500 mt-1">
            Only {product.stock} left
          </p>
        )}
      </td>

      {/* Subtotal */}
      <td className="py-4 px-4 text-sm font-semibold text-blue-600 whitespace-nowrap">
        {formatPrice(subtotal)}
      </td>

      {/* Remove */}
      <td className="py-4 pl-4 text-right">
        <button
          onClick={() => onRemove(product.id)}
          className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
          aria-label="Remove"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

// ─── Cart card (mobile) ───────────────────────────────────────────────────────

function CartCard({ item, onRemove }) {
  const { updateQuantity } = useCart();
  const { product, quantity } = item;

  const price = product.sale_price ?? product.price;
  const subtotal = price * quantity;

  const imgSrc =
    product.images?.find((img) => img.is_main)?.thumbnail_url ?? null;

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0">
      {/* Image */}
      <div className="h-20 w-20 rounded-lg bg-gray-50 overflow-hidden shrink-0">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-200">
            <ShoppingBag className="h-6 w-6" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/products/${product.slug}`}
          className="text-sm font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
        >
          {product.name}
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">{formatPrice(price)}</p>

        <div className="flex items-center justify-between mt-2">
          <QuantityInput
            value={quantity}
            max={product.stock}
            onChange={(val) => updateQuantity(product.id, val)}
          />
          <span className="text-sm font-semibold text-blue-600">
            {formatPrice(subtotal)}
          </span>
        </div>

        {product.stock <= 5 && (
          <p className="text-xs text-orange-500 mt-1">
            Only {product.stock} left
          </p>
        )}
      </div>

      {/* Remove */}
      <button
        onClick={() => onRemove(product.id)}
        className="p-1.5 h-fit rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        aria-label="Remove"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Cart ──

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeFromCart, clearCart, cartTotal, cartCount } = useCart();

  const [removeTarget, setRemoveTarget] = useState(null); // productId to remove
  const [clearModalOpen, setClearModalOpen] = useState(false);

  const handleConfirmRemove = () => {
    if (removeTarget !== null) {
      removeFromCart(removeTarget);
      setRemoveTarget(null);
    }
  };

  const handleConfirmClear = () => {
    clearCart();
    setClearModalOpen(false);
  };

  // ── Empty state ───
  if (items.length === 0) {
    return (
      <EmptyState
        preset="empty"
        title="Your cart is empty"
        description="Looks like you haven't added anything yet."
        action={
          <Button onClick={() => navigate("/products")}>Start shopping</Button>
        }
      />
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Shopping Cart
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({cartCount} {cartCount === 1 ? "item" : "items"})
            </span>
          </h1>
          <button
            onClick={() => setClearModalOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600
              hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear cart
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* ── Items ── */}
          <div className="lg:col-span-2">
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Price</th>
                    <th className="py-3 px-4 text-left">Quantity</th>
                    <th className="py-3 px-4 text-left">Subtotal</th>
                    <th className="py-3 px-4" />
                  </tr>
                </thead>
                <tbody className="px-4">
                  {items.map((item) => (
                    <CartRow
                      key={item.product.id}
                      item={item}
                      onRemove={(id) => setRemoveTarget(id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden bg-white rounded-xl border border-gray-100 px-4">
              {items.map((item) => (
                <CartCard
                  key={item.product.id}
                  item={item}
                  onRemove={(id) => setRemoveTarget(id)}
                />
              ))}
            </div>
          </div>

          {/* ── Order summary ──*/}
          <div className="mt-6 lg:mt-0">
            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-semibold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600 text-base">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button fullWidth onClick={() => navigate("/checkout")}>
                  Proceed to Checkout
                </Button>
                <Button
                  fullWidth
                  variant="ghost"
                  onClick={() => navigate("/products")}
                >
                  ← Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Remove item confirm */}
      <Modal
        open={removeTarget !== null}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleConfirmRemove}
        intent="danger"
        title="Remove item?"
        description="This item will be removed from your cart."
        confirmLabel="Remove"
        cancelLabel="Cancel"
      />

      {/* Clear cart confirm */}
      <Modal
        open={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        onConfirm={handleConfirmClear}
        intent="danger"
        title="Clear cart?"
        description="All items will be removed. This cannot be undone."
        confirmLabel="Clear cart"
        cancelLabel="Cancel"
      />
    </>
  );
}
