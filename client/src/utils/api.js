import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8056';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Customer API
export const customerAPI = {
  getAll: (params) => api.get('/api/v1/customers', { params }),
  getById: (id) => api.get(`/api/v1/customers/${id}`),
  create: (data) => api.post('/api/v1/customers/register', data),
  update: (id, data) => api.put(`/api/v1/customers/${id}`, data),
  delete: (id) => api.delete(`/api/v1/customers/${id}`),
};

// Sales Inquiry API
export const inquiryAPI = {
  getAll: (params) => api.get('/api/v1/sales-inquiries', { params }),
  getById: (id) => api.get(`/api/v1/sales-inquiries/${id}`),
  create: (data) => api.post('/api/v1/sales-inquiries', data),
  update: (id, data) => api.put(`/api/v1/sales-inquiries/${id}`, data),
  delete: (id) => api.delete(`/api/v1/sales-inquiries/${id}`),
  updateStatus: (id, status) => api.put(`/api/v1/sales-inquiries/${id}/status`, { status }),
  getByStatus: () => api.get('/api/v1/sales-inquiries/status/counts'),
};

export default api;
