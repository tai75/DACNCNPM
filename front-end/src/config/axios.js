import axios from 'axios';

<<<<<<< HEAD
const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const apiBaseUrl = normalizedBaseUrl.endsWith('/api')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
=======
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
});

// Attach JWT token for authenticated requests.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
<<<<<<< HEAD
    const status = error.response?.status;
    const message = error.response?.data?.message || "";
    const shouldLogout =
      status === 401 ||
      (status === 403 && /invalid token|token/i.test(String(message)));

    if (shouldLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-changed'));
=======
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;