import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/', // API root
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
