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

export const codingApi = {
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

  // 9. Problem status for current user
  getProblemStatus: async (problemId) => {
    const res = await apiClient.get(`/api/v1/coding/problems/${problemId}/status`);
    return res.data;
  }
};

export default codingApi;
