import axios from "axios";

const menuApi = axios.create({
  baseURL: import.meta.env.VITE_MENU_SERVICE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

menuApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default menuApi;