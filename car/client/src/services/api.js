import axios from 'axios';

const apiBaseURL = (import.meta.env.VITE_API_URL || 'https://smartmobile-server.vercel.app').replace(/\/$/, '');

const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

/* Attach token from localStorage on every request */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('autosmart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Handle 401 errors globally */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('autosmart_token');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
