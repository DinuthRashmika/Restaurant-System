import menuApi from "../api/menuApi";

export const getAllMenuItems = async () => {
  const response = await menuApi.get("/menu");
  return response.data;
};

export const getMenuItemById = async (id) => {
  const response = await menuApi.get(`/menu/${id}`);
  return response.data;
};

export const getMenuItemsByCategory = async (category) => {
  const response = await menuApi.get(`/menu/category/${category}`);
  return response.data;
};

export const getAvailableMenuItems = async () => {
  const response = await menuApi.get("/menu/available");
  return response.data;
};

export const createMenuItem = async (formData) => {
  const response = await menuApi.post("/menu", formData);
  return response.data;
};

export const updateMenuItem = async (id, formData) => {
  const response = await menuApi.put(`/menu/${id}`, formData);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await menuApi.delete(`/menu/${id}`);
  return response.data;
};