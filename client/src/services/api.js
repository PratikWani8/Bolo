import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('bolo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor with local offline cache fallback
api.interceptors.response.use(
  (response) => {
    // If successful GET for schemes or helplines, cache locally
    if (response.config.method === 'get' && response.config.url.includes('/schemes')) {
      try {
        localStorage.setItem('bolo_cached_schemes', JSON.stringify(response.data));
        localStorage.setItem('bolo_cache_timestamp', new Date().toISOString());
      } catch (e) {
        console.warn('Cache write warning:', e.message);
      }
    }
    if (response.config.method === 'get' && response.config.url.includes('/helplines')) {
      try {
        localStorage.setItem('bolo_cached_helplines', JSON.stringify(response.data));
      } catch (e) {
        console.warn('Cache write warning:', e.message);
      }
    }
    return response;
  },
  (error) => {
    // If offline or network error, attempt to return cached data
    if (!navigator.onLine || error.code === 'ERR_NETWORK') {
      if (error.config.url.includes('/schemes')) {
        const cached = localStorage.getItem('bolo_cached_schemes');
        if (cached) {
          const parsed = JSON.parse(cached);
          parsed.isOfflineCached = true;
          parsed.lastCachedAt = localStorage.getItem('bolo_cache_timestamp');
          return Promise.resolve({ data: parsed, status: 200, statusText: 'OK (Offline Cache)' });
        }
      }
      if (error.config.url.includes('/helplines')) {
        const cached = localStorage.getItem('bolo_cached_helplines');
        if (cached) {
          const parsed = JSON.parse(cached);
          parsed.isOfflineCached = true;
          return Promise.resolve({ data: parsed, status: 200, statusText: 'OK (Offline Cache)' });
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (profile) => api.put('/users/profile', profile),
};

export const schemesAPI = {
  getSchemes: (params) => api.get('/schemes', { params }),
  getSchemeById: (id) => api.get(`/schemes/${id}`),
  getCategories: () => api.get('/schemes/categories/summary'),
  createScheme: (data) => api.post('/schemes', data),
  updateScheme: (id, data) => api.put(`/schemes/${id}`, data),
  deleteScheme: (id) => api.delete(`/schemes/${id}`),
};

export const aiAPI = {
  sendChat: (data) => api.post('/ai/chat', data),
  sendVoice: (formData) =>
    api.post('/ai/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  speechToText: (formData) =>
    api.post('/ai/speech-to-text', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  textToSpeech: (data) => api.post('/ai/text-to-speech', data),
  translate: (data) => api.post('/ai/translate', data),
};

export const eligibilityAPI = {
  check: (criteria) => api.post('/eligibility/check', criteria),
};

export const helplinesAPI = {
  getHelplines: (params) => api.get('/helplines', { params }),
  createHelpline: (data) => api.post('/helplines', data),
  updateHelpline: (id, data) => api.put(`/helplines/${id}`, data),
  deleteHelpline: (id) => api.delete(`/helplines/${id}`),
};

export const knowledgeAPI = {
  getDocuments: () => api.get('/knowledge'),
  uploadDocument: (formData) =>
    api.post('/knowledge/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteDocument: (id) => api.delete(`/knowledge/${id}`),
  reprocessDocument: (id) => api.post(`/knowledge/${id}/reprocess`),
};

export const volunteerAPI = {
  createAssistedQuery: (data) => api.post('/volunteer/assisted-query', data),
  getAssistedQueries: () => api.get('/volunteer/assisted-queries'),
  getStats: () => api.get('/volunteer/stats'),
};

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUnansweredQueries: () => api.get('/admin/unanswered-queries'),
  getUsers: () => api.get('/admin/users'),
};

export default api;
