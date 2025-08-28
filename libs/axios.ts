import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4008/api",
  withCredentials: true,
});
