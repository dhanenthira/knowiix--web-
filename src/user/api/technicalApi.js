import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      const savedUser = localStorage.getItem('knowiix_admin');
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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while communicating with the server.';
    return Promise.reject(new Error(errorMsg));
  }
);

export const technicalApi = {
  // 1. Categories
  getCategories: async () => {
    const res = await apiClient.get('/api/v1/coding/categories');
    return res.data;
  },

  // 2. Filterable & Paginated Problems
  getProblems: async (params = {}) => {
    const res = await apiClient.get('/api/v1/coding/problems', { params });
    return res.data;
  },

  // 3. Problem Detail (Safe, Sample test cases only)
  getProblemDetail: async (problemId) => {
    const res = await apiClient.get(`/api/v1/coding/problems/${problemId}`);
    return res.data;
  },

  // 4. Run Code Sample
  runCode: async ({ problem_id, language, code, custom_input }) => {
    const res = await apiClient.post('/api/v1/coding/run', {
      problem_id,
      language,
      code,
      custom_input: custom_input || null
    });
    return res.data;
  },

  // 5. Submit Code Solution
  submitCode: async ({ problem_id, language, code }) => {
    const res = await apiClient.post('/api/v1/coding/submit', {
      problem_id,
      language,
      code
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('student_performance_updated'));
    }
    return res.data;
  },

  // 6. User Progress & Stats
  getUserProgress: async () => {
    const res = await apiClient.get('/api/v1/coding/progress/me');
    return res.data;
  },

  // 7. User Submissions History
  getUserSubmissions: async (params = {}) => {
    const res = await apiClient.get('/api/v1/coding/submissions/me', { params });
    return res.data;
  },

  // 8. Individual Submission Details
  getSubmissionDetail: async (submissionId) => {
    const res = await apiClient.get(`/api/v1/coding/submissions/${submissionId}`);
    return res.data;
  },

  // 10. User Profile & LeetCode-style APIs
  getUserProfile: async (username = 'me') => {
    const res = await apiClient.get(`/api/v1/users/${username}`);
    return res.data;
  },
  getUserStats: async (username = 'me') => {
    const res = await apiClient.get(`/api/v1/users/${username}/stats`);
    return res.data;
  },
  getUserActivity: async (username = 'me', year = null) => {
    const res = await apiClient.get(`/api/v1/users/${username}/activity`, {
      params: year ? { year } : {}
    });
    return res.data;
  },
  getUserContests: async (username = 'me') => {
    const res = await apiClient.get(`/api/v1/users/${username}/contests`);
    return res.data;
  },
  getUserSkills: async (username = 'me') => {
    const res = await apiClient.get(`/api/v1/users/${username}/skills`);
    return res.data;
  },
  getUserBadges: async (username = 'me') => {
    const res = await apiClient.get(`/api/v1/users/${username}/badges`);
    return res.data;
  },
  getUserSubmissionsList: async (username = 'me', params = {}) => {
    const res = await apiClient.get(`/api/v1/users/${username}/submissions`, { params });
    return res.data;
  },
  getUserAnalytics: async (username = 'me') => {
    const res = await apiClient.get(`/api/v1/users/${username}/analytics`);
    return res.data;
  },
  updateUserProfile: async (data) => {
    const res = await apiClient.put('/api/v1/users/me', data);
    return res.data;
  }
};

export const codingApi = technicalApi;
export default technicalApi;
