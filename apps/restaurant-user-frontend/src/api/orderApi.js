import axios from "axios";

const orderApi = axios.create({
  baseURL: import.meta.env.VITE_ORDER_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

orderApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default orderApi;