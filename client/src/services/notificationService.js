import api from '../config/api'

const notificationService = {
  getNotifications: async (params) => {
    const response = await api.get('/notifications', { params })
    return response.data.data
  },

  markAsRead: async (notificationId) => {
    const response = await api.patch(`/notifications/${notificationId}/read`)
    return response.data.data
  },

  markAllAsRead: async () => {
    const response = await api.post('/notifications/read-all')
    return response.data.data
  },
}

export default notificationService
