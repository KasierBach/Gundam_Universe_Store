import api from '../config/api'

const sellerService = {
  getDashboard: async () => {
    const response = await api.get('/seller/dashboard')
    return response.data.data
  },

  getProducts: async () => {
    const response = await api.get('/seller/products')
    return response.data.data
  },

  updateProduct: async (productId, payload) => {
    const response = await api.patch(`/seller/products/${productId}`, payload)
    return response.data.data
  },

  getOrders: async () => {
    const response = await api.get('/seller/orders')
    return response.data.data
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/seller/orders/${orderId}/status`, { status })
    return response.data.data
  },
}

export default sellerService
