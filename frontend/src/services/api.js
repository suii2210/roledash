import axios from 'axios';

const baseURL = (import.meta.env.VITE_API_URL || 'http://localhost:4000') + '/api';

const api = axios.create({
  baseURL,
  timeout: 10000
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message = error.response?.data?.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  logout: () => Promise.resolve()
};

export const profileApi = {
  me: () => api.get('/profile'),
  update: (payload) => api.put('/profile', payload),
  changePassword: (payload) => api.put('/profile/password', payload)
};

export const taskApi = {
  list: (params) => api.get('/tasks', { params }),
  create: (payload) => api.post('/tasks', payload),
  update: (id, payload) => api.put(`/tasks/${id}`, payload),
  remove: (id) => api.delete(`/tasks/${id}`)
};

export const noteApi = {
  list: () => api.get('/notes'),
  create: (payload) => api.post('/notes', payload),
  update: (id, payload) => api.put(`/notes/${id}`, payload),
  remove: (id) => api.delete(`/notes/${id}`)
};

export default api;
