import { useCallback, useEffect, useMemo, useReducer } from "react";
import cartService from "@/services/cartService";
import { CartContext } from "./CartContext";

function cartReducer(state, action) {
  switch (action.type) {
    case "LOAD":
      return action.payload;

    case "ADD": {
      const { product, quantity } = action.payload;
      const existing = state.find((i) => i.product.id === product.id);

      if (existing) {
        return state.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        );
      }
      return [...state, { product, quantity }];
    }

    case "UPDATE":
      return state.map((i) =>
        i.product.id === action.payload.productId
          ? { ...i, quantity: action.payload.quantity }
          : i,
      );
    case "REMOVE":
      return state.filter((i) => i.product.id !== action.payload);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

// provider
export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, cartService.load());

  useEffect(() => {
    cartService.save(items);
  }, [items]);

  const addToCart = useCallback(
    async (product, quantity = 1) => {
      const inCart =
        items.find((i) => i.product.id === product.id)?.quantity ?? 0;
      const check = await cartService.checkStock(product, quantity, inCart);

      if (!check.ok)
        return {
          success: false,
          message: check.message,
        };
      dispatch({ type: "ADD", payload: { product, quantity } });
      return { success: true };
    },
    [items],
  );

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch(
      quantity <= 0
        ? { type: "REMOVE", payload: productId }
        : { type: "UPDATE", payload: { productId, quantity } },
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: "REMOVE", payload: productId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR" });
  }, []);

  const cartTotal = useMemo(() => cartService.calcTotal(items), [items]);
  const cartCount = useMemo(() => cartService.calcCount(items), [items]);

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
    }),
    [
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
    ],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
