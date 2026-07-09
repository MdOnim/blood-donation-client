import axios from 'axios';
import toast from 'react-hot-toast';
import { getAuthToken, clearAuthSession } from '../utils/authStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const message = error.response?.data?.message;
    const isAuthRequest = error.config?.url?.includes('/auth/login');

    if (
      status === 403 &&
      (code === 'ACCOUNT_RESTRICTED' || message === 'User account restricted.') &&
      !isAuthRequest
    ) {
      clearAuthSession();
      toast.error('User account restricted.');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
