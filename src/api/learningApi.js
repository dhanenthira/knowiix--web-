import axios from 'axios';

// Get base URL (or rely on Vite proxy /api)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach authentication token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    try {
      const savedUser = localStorage.getItem('codearena_admin');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const token = parsed?.token || parsed?.access_token;
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (e) {
      console.warn('Failed to parse auth token from localStorage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified error formatting
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while communicating with the database.';
    return Promise.reject(new Error(errorMsg));
  }
);

export const learningApi = {
  // Current user details
  getCurrentUser: async () => {
    const res = await apiClient.get('/api/auth/me');
    return res.data;
  },

  // Dashboard summary stats
  getDashboardSummary: async () => {
    const res = await apiClient.get('/api/dashboard/summary');
    return res.data;
  },

  // All learning categories with tutorial count
  getCategories: async () => {
    const res = await apiClient.get('/api/categories');
    return res.data;
  },

  // Continue learning items
  getContinueLearning: async () => {
    const res = await apiClient.get('/api/dashboard/continue-learning');
    return res.data;
  },

  // Recommended tutorials
  getRecommendedTutorials: async (limit = 6) => {
    const res = await apiClient.get('/api/tutorials/recommended', { params: { limit } });
    return res.data;
  },

  // All tutorials (with category / search filter)
  getAllTutorials: async (params = {}) => {
    const res = await apiClient.get('/api/tutorials', { params });
    return res.data;
  },

  // Specific tutorial with topic list
  getTutorialDetail: async (tutorialId) => {
    const res = await apiClient.get(`/api/tutorials/${tutorialId}`);
    return res.data;
  },

  // Specific topic
  getTopicDetail: async (topicId) => {
    const res = await apiClient.get(`/api/topics/${topicId}`);
    return res.data;
  },

  // Complete a topic
  completeTopic: async (topicId) => {
    const res = await apiClient.post(`/api/topics/${topicId}/complete`);
    return res.data;
  },

  // Saved bookmarks
  getBookmarks: async () => {
    const res = await apiClient.get('/api/bookmarks');
    return res.data;
  },

  // Add bookmark
  addBookmark: async (tutorialId) => {
    const res = await apiClient.post(`/api/bookmarks/${tutorialId}`);
    return res.data;
  },

  // Remove bookmark
  removeBookmark: async (tutorialId) => {
    const res = await apiClient.delete(`/api/bookmarks/${tutorialId}`);
    return res.data;
  },

  // My overall learning progress
  getMyProgress: async () => {
    const res = await apiClient.get('/api/progress/me');
    return res.data;
  },

  // Recent activity timeline
  getRecentActivity: async (limit = 15) => {
    const res = await apiClient.get('/api/progress/recent', { params: { limit } });
    return res.data;
  },
};

export default learningApi;
