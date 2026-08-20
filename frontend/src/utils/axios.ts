import axios from "axios";

export const api = axios.create({
  // baseURL: "http://localhost:5000/api/",
  baseURL: import.meta.env.API_BASE_URL,
  withCredentials: true,
});
