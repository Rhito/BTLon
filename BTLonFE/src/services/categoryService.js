import api from "@/api/axiosInstance";

const categoryService = {
  // guest
  getCategories: (params = {}) => api.get("/categories", { params }),

  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`),
  getCategoryProductCount: (slug) => api.get(`/categories/count/${slug}`),

  // admin
  createCategory: (data) => api.post("/categories", data),

  updateCategory: (id, data) => api.put(`/categories/${id}`, data),

  deleteCategory: (id) => api.delete(`/categories/${id}`),

  restoreCategory: (id) => api.patch(`/categories/${id}/restore`),
};

export default categoryService;
