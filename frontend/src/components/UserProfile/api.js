import axios from 'axios';
import { BASE_URL } from '../../config/api';

const api = axios.create({
  baseURL: BASE_URL, // API root
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Authorization header dynamically before each request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access'); // get fresh token each time
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
