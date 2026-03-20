import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Pets API
export const petsAPI = {
  getAll: (params) => api.get('/pets', { params }),
  getById: (id) => api.get(`/pets/${id}`),
  getBreeds: () => api.get('/pets/breeds'),
  getStats: () => api.get('/pets/stats'),
  create: (data) => api.post('/pets', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => api.put(`/pets/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/pets/${id}`),
};

// Reviews API
export const reviewsAPI = {
  getAll: () => api.get('/reviews'),
  getAllAdmin: () => api.get('/reviews/all'),
  getStats: () => api.get('/reviews/stats'),
  create: (data) => api.post('/reviews', data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Gallery API
export const galleryAPI = {
  getAll: (params) => api.get('/gallery', { params }),
  upload: (data) => api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Auth API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  setup: () => api.post('/auth/setup'),
};

export default api;
