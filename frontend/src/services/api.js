import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const itemsAPI = {
  createItem: (formData) => API.post('/items', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyReports: () => API.get('/items/my-reports'),
  getItem: (id) => API.get(`/items/${id}`),
  updateStatus: (id, status) => API.put(`/items/${id}/status`, { status }),
};

export const matchesAPI = {
  getMyMatches: () => API.get('/matches/my-matches'),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getAllItems: () => API.get('/admin/items'),
  getAllMatches: () => API.get('/admin/matches'),
  updateMatchStatus: (id, status) => API.put(`/admin/matches/${id}/status`, { status }),
};

export const demoAPI = {
  seedData: () => API.post('/demo/seed'),
};

export default API;
