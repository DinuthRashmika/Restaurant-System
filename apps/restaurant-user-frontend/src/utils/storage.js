export const saveAuth = (data) => {
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("fullName", data.fullName);
  localStorage.setItem("email", data.email);
  localStorage.setItem("role", data.role);
};

export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("fullName");
  localStorage.removeItem("email");
  localStorage.removeItem("role");
};

export const getAuth = () => ({
  token: localStorage.getItem("token"),
  userId: localStorage.getItem("userId"),
  fullName: localStorage.getItem("fullName"),
  email: localStorage.getItem("email"),
  role: localStorage.getItem("role"),
});