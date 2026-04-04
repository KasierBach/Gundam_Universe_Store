import axios from 'axios'
import useAuthStore from '../stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request Interceptor: Attach Auth Token
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const isRefreshRequest = originalRequest?.url?.includes('/auth/refresh-token')

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry && !isRefreshRequest) {
      originalRequest._retry = true

      try {
        const { refreshToken: refresh } = useAuthStore.getState()
        if (!refresh) {
          throw error
        }

        const response = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { refreshToken: refresh },
          { withCredentials: true }
        )
        const { accessToken, refreshToken } = response.data.data

        useAuthStore.getState().setTokens(accessToken, refreshToken ?? refresh)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().clearAuthState()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
