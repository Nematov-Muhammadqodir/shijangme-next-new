import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://72.60.41.172:4008/api",
  withCredentials: true,
});
