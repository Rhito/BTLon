import api from "@/api/axiosInstance";
const productService = {
  // guest
  getProducts: (params = {}) => api.get("/products", { params }),
  getProductBySlug: (slug) => api.get(`/products/${slug}`),

  // admin
  createProduct: (data) => api.post(`/products`, data),

  updateProduct: (id, data) => api.put(`/products/${id}`, data),

  deleteProduct: (id) => api.delete(`/products/${id}`),

  restoreProduct: (id) => api.patch(`/products/${id}/restore`),

  // Admin — Image handling

  // Upload nhiều ảnh — field: images[], main_image_index
  uploadImages: (slug, formData) =>
    api.post(`/product-images/uploads/${slug}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Update 1 ảnh — field: image (singular), set_as_main (optional boolean)
  updateImage: (imageId, slug, formData) =>
    api.post(`/product-images/${imageId}/update/${slug}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteImage: (imageId, slug) =>
    api.delete(`/product-images/${imageId}/delete/${slug}`),
};

export default productService;
