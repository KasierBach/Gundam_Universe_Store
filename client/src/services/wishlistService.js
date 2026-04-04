import api from '../config/api'

const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist')
    return response.data.data
  },

  addProduct: async (productId) => {
    const response = await api.post('/wishlist/items', { productId })
    return response.data.data
  },

  removeProduct: async (productId) => {
    const response = await api.delete(`/wishlist/items/${productId}`)
    return response.data.data
  },

  clearWishlist: async () => {
    const response = await api.delete('/wishlist/clear')
    return response.data.data
  },
}

export default wishlistService
