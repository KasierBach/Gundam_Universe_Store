import api from '../config/api';

const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },

  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data.data;
  },

  getOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data.data;
  },

  getTrades: async () => {
    const response = await api.get('/admin/trades');
    return response.data.data;
  },

  updateTradeStatus: async (tradeId, status) => {
    const response = await api.patch(`/admin/trades/${tradeId}/status`, { status });
    return response.data.data;
  },
};

export default adminService;
