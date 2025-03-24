import { College, CollegeRequest } from "../types/college";
import { authAxios } from "./auth";

export const collegeApi = {
  // Get all colleges
  getAllColleges: async (): Promise<College[]> => {
    try {
      const response = await authAxios.get("/api/colleges");
      return response.data;
    } catch (error) {
      console.error("Get all colleges error:", error);
      throw error;
    }
  },

  // Get college by ID
  getCollegeById: async (id: number): Promise<College> => {
    try {
      const response = await authAxios.get(`/api/colleges/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get college by ID error:", error);
      throw error;
    }
  },

  // Create college (Super Admin only)
  createCollege: async (collegeData: CollegeRequest): Promise<College> => {
    try {
      const response = await authAxios.post("/api/superadmin/colleges", collegeData);
      return response.data;
    } catch (error) {
      console.error("Create college error:", error);
      throw error;
    }
  },

  // Update college (Super Admin only)
  updateCollege: async (
    id: number,
    collegeData: CollegeRequest
  ): Promise<College> => {
    try {
      const response = await authAxios.put(`/api/superadmin/colleges/${id}`, collegeData);
      return response.data;
    } catch (error) {
      console.error("Update college error:", error);
      throw error;
    }
  },

  // Delete college (Super Admin only)
  deleteCollege: async (id: number): Promise<void> => {
    try {
      await authAxios.delete(`/api/superadmin/colleges/${id}`);
    } catch (error) {
      console.error("Delete college error:", error);
      throw error;
    }
  },
};
