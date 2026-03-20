import api from "../api/axios";

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const updateUser = async (id, payload) => {
  const response = await api.put(`/users/${id}`, payload);
  return response.data;
};