import api from '../config/api'

const sellerService = {
  getDashboard: async () => {
    const response = await api.get('/seller/dashboard')
    return response.data.data
  },
}

export default sellerService
