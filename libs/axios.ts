// axios.ts
import axios, { AxiosRequestConfig } from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://72.60.41.172:4008/api", // or your IP:port
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    (config.headers ||= {}).Authorization = `Bearer ${token}`;
  }
  return config;
});
// https://72.60.41.172
