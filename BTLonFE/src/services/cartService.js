import api from "@/api/axiosInstance";

const cartService = {
  checkStock: async (product, quantity, inCart = 0) => {
    const res = await api.get(`/products/${product.slug}`);
    const latest = res.data;

    if (!latest.is_active) {
      return {
        ok: false,
        message: "The product is no longer being sold.",
      };
    }

    if (inCart + quantity > latest.stock) {
      return {
        ok: false,
        message: `Only ${latest.stock} products are left in stock (you already have ${inCart} in your cart)`,
      };
    }

    return { ok: true };
  },

  calcTotal: (items) => {
    return items.reduce((sum, { product, quantity }) => {
      if (!product) return sum;
      const price = product.sale_price ?? product.price ?? 0;
      return sum + price * (quantity || 0);
    }, 0);
  },
  calcCount: (items) => items.reduce((sum, { quantity }) => sum + quantity, 0),

  load: () => {
    try {
      const saved = localStorage.getItem("cart_items");
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed.filter((i) => i && i.product) : [];
    } catch {
      return [];
    }
  },

  save: (items) => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  },
};

export default cartService;
