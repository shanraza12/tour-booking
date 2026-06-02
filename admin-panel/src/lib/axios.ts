import axios from 'axios';
import { getLocalItem } from '../helpers/storageUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  
});
api.interceptors.request.use(
  (config) => {
    const token = getLocalItem('token'); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Add interceptors here for token injection if needed
export default api;