import { menuApi } from './api';

export const getAvailableMenu = async () => {
  const response = await menuApi.get('/menu/available');
  return response.data;
};