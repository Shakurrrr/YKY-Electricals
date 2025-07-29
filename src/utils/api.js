import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    // Enhanced error handling
    const errorMessage = error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
    
    return Promise.reject({
      ...error,
      message: errorMessage
    });
  }
);

// ===========================
// Auth API
// ===========================
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response;
  },

  register: async (email, password, firstName, lastName) => {
    const response = await api.post('/auth/register', { 
      email, 
      password, 
      firstName, 
      lastName 
    });
    return response;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response;
  },
};

// ===========================
// Bookings API
// ===========================
export const bookingsAPI = {
  create: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  getAllBookings: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status !== 'all') {
      params.append('status', filters.status);
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    const queryString = params.toString();
    const response = await api.get(`/bookings/all${queryString ? `?${queryString}` : ''}`);
    return response.data;
  },

  updateStatus: async (id, status, adminComment = '') => {
    const response = await api.put(`/bookings/${id}/status`, { 
      status, 
      adminComment 
    });
    return response.data;
  },
};

// ===========================
// Contact API
// ===========================
export const contactAPI = {
  submit: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/contact/${id}/read`);
    return response.data;
  },
};

// ===========================
// Projects API
// ===========================
export const projectsAPI = {
  getAll: async (category) => {
    const query = category && category !== 'all' ? `?category=${category}` : '';
    const response = await api.get(`/projects${query}`);
    return response.data;
  },

  create: async (formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_BASE_URL}/projects`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 seconds for file uploads
    });
    return response.data;
  },

  update: async (id, formData) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${API_BASE_URL}/projects/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// ===========================
// Admin API
// ===========================
export const adminAPI = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getRecentActivities: async () => {
    const response = await api.get('/admin/recent-activities');
    return response.data;
  },
};

// Default export
export default api;