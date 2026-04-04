import { create } from 'zustand';
import orderService from '../services/orderService';

const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,
  currentOrder: null,

  /**
   * Fetch order history for current pilot
   */
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const orders = await orderService.getHistory();
      set({ orders, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  /**
   * Create new order (Checkout)
   */
  checkout: async (orderData) => {
    set({ loading: true });
    try {
      const order = await orderService.createOrder(orderData);
      set((state) => ({ 
        orders: [order, ...state.orders], 
        currentOrder: order,
        loading: false 
      }));
      return order;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  /**
   * Get specific order details
   */
  fetchOrderDetail: async (orderId) => {
    set({ loading: true });
    try {
      const order = await orderService.getOrderDetail(orderId);
      set({ currentOrder: order, loading: false });
      return order;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  resetCurrentOrder: () => set({ currentOrder: null })
}));

export default useOrderStore;
