import * as auth from "../types/auth";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const authApi = {
  // SignUp service
  signUp: async (credentials: auth.SignUpCredentials) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/ signup`,
        credentials
      );
      return response.data;
    } catch (error: any) {
      console.log("Http status code: ", error.response.status);
      return error.response.data;
    }
  },

  // Login service
  login: async (credentials: auth.LoginCredentials) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        credentials
      );
      return response.data;
    } catch (error: any) {
      console.log("Http status code: ", error.response.status);
      return error.response.data;
    }
  },

  // Verify token service
  verifyToken: async (token: string) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/verify`, {
        token,
      });
      return response.data;
    } catch (error: any) {
      console.log("Http status code: ", error.response.status);
      return error.response.data;
    }
  },
};
