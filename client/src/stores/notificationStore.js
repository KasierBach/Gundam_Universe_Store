import { create } from 'zustand'
import notificationService from '../services/notificationService'

const useNotificationStore = create((set, get) => ({
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
  isLoaded: false,

  fetchNotifications: async (params) => {
    set({ loading: true })
    try {
      const data = await notificationService.getNotifications(params)
      set({
        items: data.items || [],
        unreadCount: data.unreadCount || 0,
        loading: false,
        error: null,
        isLoaded: true,
      })
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || error.message,
      })
    }
  },

  prependNotification: (notification) => {
    const currentItems = get().items
    set({
      items: [notification, ...currentItems],
      unreadCount: get().unreadCount + (notification?.isRead ? 0 : 1),
    })
  },

  markAsRead: async (notificationId) => {
    const updated = await notificationService.markAsRead(notificationId)
    set((state) => ({
      items: state.items.map((item) => (item._id === notificationId ? updated : item)),
      unreadCount: Math.max(
        0,
        state.unreadCount - (state.items.find((item) => item._id === notificationId && !item.isRead) ? 1 : 0)
      ),
    }))
  },

  markAllAsRead: async () => {
    const data = await notificationService.markAllAsRead()
    set({
      items: data.items || [],
      unreadCount: data.unreadCount || 0,
    })
  },
}))

export default useNotificationStore
