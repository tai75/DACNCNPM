import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const apiBaseUrl = normalizedBaseUrl.endsWith('/api')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/api`;

const api = axios.create({
  baseURL: apiBaseUrl,
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
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "";
    const shouldLogout =
      status === 401 ||
      (status === 403 && /invalid token|token/i.test(String(message)));

    const normalizedError =
      error instanceof Error
        ? error
        : new Error(message || error?.message || "Unknown API error");

    if (shouldLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('auth-changed'));
      window.location.href = '/login';
    }

    return Promise.reject(normalizedError);
  }
);

export default api;