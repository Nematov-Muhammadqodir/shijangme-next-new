// axios.ts
import axios, { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://kadai.uz/api", // or your IP:port
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    (config.headers ||= {}).Authorization = `Bearer ${token}`;
  }
  return config;
});
