import { authAxios } from "./auth";
import { User } from "../types/user";

export const userApi = {
  // Search for users by email
  searchByEmail: async (email: string): Promise<User[]> => {
    try {
      const response = await authAxios.get(`/api/users/search?email=${email}`);
      return response.data;
    } catch (error) {
      console.error("Search users by email error:", error);
      throw error;
    }
  },
};
