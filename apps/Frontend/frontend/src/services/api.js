import axios from 'axios';

// Create base instances for your three microservices
export const userApi = axios.create({ baseURL: 'http://localhost:8081/api' });
export const menuApi = axios.create({ baseURL: 'http://localhost:8082/api' });
export const orderApi = axios.create({ baseURL: 'http://localhost:8083/api' });

// Add JWT token to all requests automatically
const authInterceptor = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

userApi.interceptors.request.use(authInterceptor);
menuApi.interceptors.request.use(authInterceptor);
orderApi.interceptors.request.use(authInterceptor);