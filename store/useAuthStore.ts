// @ts-nocheck
import { create } from "zustand";
import { axiosInstance } from "@/libs/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = process.env.NEXT_PUBLIC_CHAT_URL;

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ authUser: null, isCheckingAuth: false });
      return;
    }

    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
      localStorage.removeItem("token");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      // res.data = { token, user: {...} }
      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);

      localStorage.setItem("token", res.data.token);

      set({ authUser: res.data.user });
      toast.success("Account created successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    localStorage.removeItem("token");
    set({ authUser: null });
    toast.success("Logged out successfully");
    get().disconnectSocket();
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const isFormData = data instanceof FormData;

      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : undefined,
      });

      console.log("res.data uploded", res.data);

      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: async () => {
    const token = localStorage.getItem("token");
    if (!token || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      auth: { token }, // send token in handshake
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: async () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
