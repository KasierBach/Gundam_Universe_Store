import api from '../config/api'

const reportService = {
  createTradeListingReport: async (listingId, payload) => {
    const response = await api.post(`/trades/${listingId}/report`, payload)
    return response.data.data
  },

  getReports: async (params) => {
    const response = await api.get('/reports', { params })
    return response.data.data
  },

  updateStatus: async (reportId, payload) => {
    const response = await api.patch(`/reports/${reportId}/status`, payload)
    return response.data.data
  },
}

export default reportService
