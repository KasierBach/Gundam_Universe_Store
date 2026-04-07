import api from '../config/api'

const chatService = {
  /**
   * Get user's conversations
   */
  getConversations: async () => {
    const response = await api.get('/chat/conversations')
    return response.data.data
  },

  /**
   * Create or reopen a direct conversation with another user.
   */
  startDirectConversation: async (recipientId, context = {}) => {
    const response = await api.post('/chat/conversations/direct', {
      recipientId,
      ...context,
    })
    return response.data.data
  },

  /**
   * Get messages for a specific conversation
   */
  getMessages: async (conversationId, params) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages`, { params })
    return response.data.data
  },

  /**
   * Send a message via REST (as fallback or for simple text)
   */
  sendMessage: async (conversationId, payload) => {
    const isMultipart = payload instanceof FormData
    const response = await api.post(`/chat/conversations/${conversationId}/messages`, payload, isMultipart
      ? {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      : undefined)
    return response.data.data
  },

  /**
   * Mark messages as read
   */
  markAsRead: async (conversationId) => {
    const response = await api.post(`/chat/conversations/${conversationId}/read`)
    return response.data
  }
}

export default chatService
