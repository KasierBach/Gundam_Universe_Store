import api from '../config/api'

const authService = {
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data.data
  },

  resetPassword: async ({ token, newPassword, confirmNewPassword }) => {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword,
      confirmNewPassword,
    })
    return response.data.data
  },
}

export default authService
