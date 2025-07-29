const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }
  return null;
};

// Create headers with auth token
const createHeaders = (includeAuth = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: createHeaders(false),
    });
  },

  register: async (email: string, password: string, firstName: string, lastName: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName }),
      headers: createHeaders(false),
    });
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData: {
    name: string;
    email: string;
    phone: string;
    serviceType: string;
    preferredDate: string;
    description: string;
  }) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getMyBookings: async () => {
    return apiRequest('/bookings/my-bookings');
  },

  getAllBookings: async (filters?: { status?: string; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    return apiRequest(`/bookings/all${queryString ? `?${queryString}` : ''}`);
  },

  updateStatus: async (id: string, status: string, adminComment?: string) => {
    return apiRequest(`/bookings/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, adminComment }),
    });
  },
};

// Contact API
export const contactAPI = {
  submit: async (contactData: { name: string; email: string; message: string }) => {
    return apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
      headers: createHeaders(false),
    });
  },

  getAll: async () => {
    return apiRequest('/contact');
  },

  markAsRead: async (id: string) => {
    return apiRequest(`/contact/${id}/read`, {
      method: 'PUT',
    });
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (category?: string) => {
    const params = category && category !== 'all' ? `?category=${category}` : '';
    return apiRequest(`/projects${params}`);
  },

  create: async (formData: FormData) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  },

  update: async (id: string, formData: FormData) => {
    const token = getAuthToken();
    return fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  getRecentActivities: async () => {
    return apiRequest('/admin/recent-activities');
  },
};

export default {
  authAPI,
  bookingsAPI,
  contactAPI,
  projectsAPI,
  adminAPI,
};