import api from "@/api/axiosInstance";
const orderService = {
  // Guest

  checkout: (data) => api.post("/orders/checkout", data),

  trackOrder: (data) => api.post("/orders/track", data),

  requestCancel: (data) => api.post("/orders/request-cancel", data),

  confirmCancel: (data) => api.post("/orders/confirm-cancel", data),

  // Admin

  getOrders: (params = {}) => api.get("/orders", { params }),

  getOrderById: (id) => api.get(`/orders/${id}`),

  updateOrder: (id, data) => api.put(`/orders/${id}`, data),

  // Export CSV — responseType blob để download file
  exportOrders: (params = {}) =>
    api.get("/orders/export", {
      params,
      responseType: "blob",
    }),
};

export default orderService;
