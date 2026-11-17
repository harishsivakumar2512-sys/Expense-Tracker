import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get token from either localStorage or sessionStorage
export const getToken = () => {
  return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token') || sessionStorage.getItem('refresh_token');
};

export const setTokens = (access, refresh, rememberMe = true) => {
  if (rememberMe) {
    localStorage.setItem('access_token', access);
    if (refresh) localStorage.setItem('refresh_token', refresh);
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  } else {
    sessionStorage.setItem('access_token', access);
    if (refresh) sessionStorage.setItem('refresh_token', refresh);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
};

// Request interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh if expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh = getRefreshToken();
      if (refresh) {
        try {
          const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refresh,
          });
          if (res.data.access) {
            const rememberMe = !!localStorage.getItem('access_token');
            setTokens(res.data.access, refresh, rememberMe);
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return api(originalRequest);
          }
        } catch (refreshErr) {
          clearTokens();
          window.dispatchEvent(new Event('auth:logout'));
        }
      } else {
        clearTokens();
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginApi = async (email, password, rememberMe = true) => {
  const response = await api.post('/auth/login/', { email, password });
  if (response.data.access) {
    setTokens(response.data.access, response.data.refresh, rememberMe);
  }
  return response.data;
};

export const registerApi = async (name, email, password, confirmPassword, rememberMe = true) => {
  const response = await api.post('/auth/register/', {
    name,
    email,
    password,
    confirm_password: confirmPassword,
  });
  if (response.data.access) {
    setTokens(response.data.access, response.data.refresh, rememberMe);
  }
  return response.data;
};

export const logoutApi = async () => {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await api.post('/auth/logout/', { refresh });
    }
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    clearTokens();
  }
};

export const getCurrentUserApi = async () => {
  const response = await api.get('/auth/me/');
  return response.data;
};

// Dashboard endpoints
export const getSummaryApi = async (period = 'this_month') => {
  const response = await api.get(`/dashboard/summary/?period=${period}`);
  return response.data;
};

export const getOverviewApi = async (range = 'this_month') => {
  const response = await api.get(`/dashboard/overview/?range=${range}`);
  return response.data;
};

export const getCategorySpendingApi = async (period = 'this_month') => {
  const response = await api.get(`/dashboard/category-spending/?period=${period}`);
  return response.data;
};

// Transactions endpoints
export const getTransactionsApi = async (limit = null) => {
  const url = limit ? `/transactions/?limit=${limit}` : '/transactions/';
  const response = await api.get(url);
  return response.data;
};

export const addTransactionApi = async ({ type, category_id, amount, note }) => {
  const response = await api.post('/transactions/', {
    type,
    category_id,
    amount,
    note,
  });
  return response.data;
};

export const deleteTransactionApi = async (id) => {
  const response = await api.delete(`/transactions/${id}/`);
  return response.data;
};

// Categories endpoint
export const getCategoriesApi = async () => {
  const response = await api.get('/categories/');
  return response.data;
};

export default api;
