import { orderApi } from './api';

export const createOrder = async (orderData) => {
  const response = await orderApi.post('/orders', orderData);
  return response.data;
};

export const getCustomerOrders = async (customerId) => {
  const response = await orderApi.get(`/orders/customer/${customerId}`);
  return response.data;
};

export const getAllOrders = async () => {
  const response = await orderApi.get('/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await orderApi.put(`/orders/${id}/status`, { status });
  return response.data;
};