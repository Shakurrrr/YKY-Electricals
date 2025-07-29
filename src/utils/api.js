import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===========================
// Auth API
// ===========================
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  register: (email, password, firstName, lastName) =>
    api.post('/auth/register', { email, password, firstName, lastName }),

  getCurrentUser: () => api.get('/auth/me'),
};

// ===========================
// Bookings API
// ===========================
export const bookingsAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),

  getMyBookings: () => api.get('/bookings/my-bookings'),

  getAllBookings: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    return api.get(`/bookings/all${params.toString() ? `?${params}` : ''}`);
  },

  updateStatus: (id, status, adminComment) =>
    api.put(`/bookings/${id}/status`, { status, adminComment }),
};

// ===========================
// Contact API
// ===========================
export const contactAPI = {
  submit: (contactData) =>
    api.post('/contact', contactData),

  getAll: () => api.get('/contact'),

  markAsRead: (id) => api.put(`/contact/${id}/read`),
};

// ===========================
// Projects API
// ===========================
export const projectsAPI = {
  getAll: (category) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    return api.get(`/projects${query}`);
  },

  create: (formData) => {
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;
    return axios.post(`${API_BASE_URL}/projects`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  update: (id, formData) => {
    const user = localStorage.getItem('user');
    const token = user ? JSON.parse(user).token : null;
    return axios.put(`${API_BASE_URL}/projects/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  delete: (id) => api.delete(`/projects/${id}`),
};

// ===========================
// Admin API
// ===========================
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getRecentActivities: () => api.get('/admin/recent-activities'),
};

// ===========================
// Default export
// ===========================
export default {
  authAPI,
  bookingsAPI,
  contactAPI,
  projectsAPI,
  adminAPI,
};
