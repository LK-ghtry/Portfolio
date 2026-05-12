import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const client = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token && config.url?.includes('/admin')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && err.config.url?.includes('/admin')) {
      localStorage.removeItem('admin_token');
      const hash = window.location.hash;
      if (hash.includes('/admin') && !hash.includes('/admin/login')) {
        window.location.hash = '#/admin';
      }
    }
    return Promise.reject(err);
  }
);

export default client;
