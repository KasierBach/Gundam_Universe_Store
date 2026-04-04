import api from '../config/api';

const orderService = {
  /**
   * Create new order (Checkout)
   * @param {Object} orderData { shippingAddress, paymentMethod, notes }
   */
  createOrder: async (orderData) => {
    const response = await api.post('/orders/checkout', orderData);
    return response.data.data;
  },

  /**
   * Get mission logs (order history)
   */
  getHistory: async () => {
    const response = await api.get('/orders/history');
    return response.data.data;
  },

  /**
   * Get specific order details
   */
  getOrderDetail: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data.data;
  }
};

export default orderService;
