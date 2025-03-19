import * as auth from "../types/auth";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";

// Create an axios instance with auth header
export const authAxios = axios.create({
  baseURL: BASE_URL,
});

// Add interceptor to add auth token to requests
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-storage")
      ? JSON.parse(localStorage.getItem("auth-storage") || "{}")?.state?.token
      : null;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add interceptor to handle token expiration
authAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear auth and redirect to login
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  // SignUp service
  signUp: async (credentials: auth.SignUpCredentials) => {
    try {
      const response = await authAxios.post("/api/auth/signup", credentials);
      return response.data;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  },

  // Login service
  login: async (credentials: auth.LoginCredentials) => {
    try {
      const response = await authAxios.post("/api/auth/login", credentials);
      return response.data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  },

  // Verify token service
  verifyToken: async (token: string) => {
    try {
      const response = await authAxios.post("/api/auth/verify", { token });
      return response.data;
    } catch (error: any) {
      console.error("Token verification error:", error);
      throw error;
    }
  },
};
