import { userApi } from './api';

export const login = async (credentials) => {
  const response = await userApi.post('/auth/login', credentials);
  return response.data; // Expected: { success, message, data: { token, role, ... } }
};

export const register = async (userData) => {
  const response = await userApi.post('/auth/register', userData);
  return response.data;
};