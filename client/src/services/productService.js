import api from '../config/api';

const productService = {
  /**
   * Get products with filters
   * @param {Object} params 
   */
  getProducts: async (params) => {
    const response = await api.get('/products', { params });
    return response.data.data;
  },

  /**
   * Get product by slug
   * @param {string} slug 
   */
  getProductBySlug: async (slug) => {
    const response = await api.get(`/products/${slug}`);
    return response.data.data;
  },

  getRecommendations: async (slug, params) => {
    const response = await api.get(`/products/${slug}/recommendations`, { params });
    return response.data.data;
  },

  /**
   * Create product (Admin/Seller)
   * @param {Object} data 
   */
  createProduct: async (data) => {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined
    const response = await api.post('/products', data, config);
    return response.data.data;
  },

  /**
   * Update product (Admin/Seller)
   * @param {string} id 
   * @param {Object} data 
   */
  updateProduct: async (id, data) => {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined
    const response = await api.put(`/products/${id}`, data, config);
    return response.data.data;
  },

  /**
   * Delete product (Admin/Seller)
   * @param {string} id 
   */
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data.data;
  },
};

export default productService;
