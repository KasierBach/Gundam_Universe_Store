import api from '../config/api';

const categoryService = {
  /**
   * Get active categories
   */
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data.data;
  },

  /**
   * Get all categories (Admin/Seller)
   */
  getAllCategories: async () => {
    const response = await api.get('/categories/all');
    return response.data.data;
  },

  /**
   * Create category (Admin)
   * @param {Object} data 
   */
  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data.data;
  },

  /**
   * Update category (Admin)
   * @param {string} id 
   * @param {Object} data 
   */
  updateCategory: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  /**
   * Toggle category status (Admin)
   * @param {string} id 
   */
  toggleCategoryStatus: async (id) => {
    const response = await api.patch(`/categories/${id}/status`);
    return response.data.data;
  },
};

export default categoryService;
