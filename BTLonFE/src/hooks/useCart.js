// hooks/useCart.js
import { useContext } from "react";
import { CartContext } from "@/contexts/CartContext";

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be wrapped in <CartProvider>");
  return ctx;
}
