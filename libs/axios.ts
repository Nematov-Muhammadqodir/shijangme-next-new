// axios.ts
import axios, { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    (config.headers ||= {}).Authorization = `Bearer ${token}`;
  }
  return config;
});
