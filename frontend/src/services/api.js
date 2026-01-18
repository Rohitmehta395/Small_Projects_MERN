import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor (Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const registerAPI = async (credentials) => {
  const res = await api.post("/api/auth/register", credentials);
  return res.data;
};

export const loginAPI = async (credentials) => {
  const res = await api.post("/api/auth/login", credentials);
  return res.data;
};

export const taskAPI = {
  createTask: (task) => api.post("/api/tasks", task),
  getTasks: () => api.get("/api/tasks"),
  updateTask: (taskId, task) => api.put(`/api/tasks/${taskId}`, task),
  deleteTask: (taskId) => api.delete(`/api/tasks/${taskId}`),
};
