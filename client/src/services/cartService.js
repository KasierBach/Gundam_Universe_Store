import api from '../config/api';

const cartService = {
  /**
   * Get current user's cart
   */
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data.data;
  },

  /**
   * Add item to cart
   */
  addItem: async (productId, quantity = 1) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data.data;
  },

  /**
   * Update item quantity
   */
  updateQuantity: async (productId, quantity) => {
    const response = await api.put('/cart/update', { productId, quantity });
    return response.data.data;
  },

  /**
   * Remove item from cart
   */
  removeItem: async (productId) => {
    const response = await api.delete(`/cart/item/${productId}`);
    return response.data.data;
  },

  /**
   * Clear all items
   */
  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data.data;
  }
};

export default cartService;
