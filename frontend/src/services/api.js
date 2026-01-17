import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const registerAPI = async (credentials) => {
  const res = await api.post("/api/auth/register", credentials);
  return res.data;
};
