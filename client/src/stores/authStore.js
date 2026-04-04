import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../config/api'

const REMEMBERED_EMAIL_KEY = 'gundam-remembered-email'

const clearPersistedUserData = () => {
  localStorage.removeItem('auth-storage')
  localStorage.removeItem('gundam-cart-storage')
  localStorage.removeItem('gundam-order-storage')
  localStorage.removeItem('gundam-notification-storage')
  localStorage.removeItem('gundam-wishlist-storage')
}

const getRememberedEmail = () => {
  if (typeof window === 'undefined') {
    return ''
  }

  return localStorage.getItem(REMEMBERED_EMAIL_KEY) || ''
}

const persistRememberedEmail = (email, rememberMe) => {
  if (typeof window === 'undefined') {
    return
  }

  if (rememberMe && email) {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, email)
    return
  }

  localStorage.removeItem(REMEMBERED_EMAIL_KEY)
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: true,
      rememberedEmail: getRememberedEmail(),

      setAuth: (user, accessToken, refreshToken) => set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: !!user,
      }),

      setTokens: (accessToken, refreshToken) => set({
        accessToken,
        refreshToken,
      }),

      setRememberMe: (rememberMe) => {
        if (!rememberMe) {
          persistRememberedEmail('', false)
        }

        set((state) => ({
          rememberMe,
          rememberedEmail: rememberMe ? state.rememberedEmail : '',
        }))
      },

      setRememberedEmail: (email) => {
        persistRememberedEmail(email, !!email)
        set({
          rememberedEmail: email,
          rememberMe: !!email,
        })
      },

      clearAuthState: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
        clearPersistedUserData()
      },

      login: async (email, password, options = {}) => {
        const rememberMe = options.rememberMe ?? get().rememberMe
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/login', { email, password })
          const { user, accessToken, refreshToken } = response.data.data
          persistRememberedEmail(email, rememberMe)
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            rememberMe,
            rememberedEmail: rememberMe ? email : '',
          })
          return response.data
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ isLoading: true })
        try {
          const response = await api.post('/auth/register', data)
          const { user, accessToken, refreshToken } = response.data.data
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          })
          return response.data
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        const { refreshToken } = get()
        try {
          await api.post('/auth/logout', { refreshToken })
        } finally {
          get().clearAuthState()
        }
      },

      checkAuth: async () => {
        let { accessToken, refreshToken } = get()

        if (!accessToken && refreshToken) {
          try {
            const response = await api.post('/auth/refresh-token', { refreshToken })
            accessToken = response.data.data.accessToken
            refreshToken = response.data.data.refreshToken ?? refreshToken
            get().setTokens(accessToken, refreshToken)
          } catch (_error) {
            get().clearAuthState()
            return
          }
        }

        if (!accessToken) return

        try {
          const response = await api.get('/users/me')
          set({
            user: response.data.data,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          if (error.response?.status === 401) {
            get().clearAuthState()
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        rememberMe: state.rememberMe,
        rememberedEmail: state.rememberedEmail,
      }),
    }
  )
)

export default useAuthStore
