import api from '../config/api';

const userService = {
  getProfile: async () => {
    const response = await api.get('/users/me');
    return response.data.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data.data;
  },

  updateAvatar: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.put('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  getPublicProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data.data;
  },
};

export default userService;
