import { Rso, RsoRequest } from "../types/rso";
import { authAxios } from "./auth";

export const rsoApi = {
  // Get all RSOs
  getAllRsos: async (): Promise<Rso[]> => {
    try {
      const response = await authAxios.get("/api/rsos");
      return response.data;
    } catch (error) {
      console.error("Get all RSOs error:", error);
      throw error;
    }
  },

  // Get RSOs administered by current user
  getMyRsos: async (): Promise<Rso[]> => {
    try {
      const response = await authAxios.get("/api/admin/rsos");
      return response.data;
    } catch (error) {
      console.error("Get admin RSOs error:", error);
      throw error;
    }
  },

  // Get RSO by ID
  getRsoById: async (id: number): Promise<Rso> => {
    try {
      const response = await authAxios.get(`/api/rsos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get RSO by ID error:", error);
      throw error;
    }
  },

  // Create new RSO (Admin only)
  createRso: async (rsoData: RsoRequest): Promise<Rso> => {
    try {
      const response = await authAxios.post("/api/admin/rsos", rsoData);
      return response.data;
    } catch (error) {
      console.error("Create RSO error:", error);
      throw error;
    }
  },

  // Update RSO (Admin only)
  updateRso: async (id: number, rsoData: RsoRequest): Promise<Rso> => {
    try {
      const response = await authAxios.put(`/api/admin/rsos/${id}`, rsoData);
      return response.data;
    } catch (error) {
      console.error("Update RSO error:", error);
      throw error;
    }
  },

  // Delete RSO (Admin only)
  deleteRso: async (id: number): Promise<void> => {
    try {
      await authAxios.delete(`/api/admin/rsos/${id}`);
    } catch (error) {
      console.error("Delete RSO error:", error);
      throw error;
    }
  },

  // Get RSO members
  getRsoMembers: async (id: number): Promise<any[]> => {
    try {
      const response = await authAxios.get(`/api/rsos/${id}/members`);
      return response.data;
    } catch (error) {
      console.error("Get RSO members error:", error);
      throw error;
    }
  },

  // Join RSO
  joinRso: async (id: number): Promise<void> => {
    try {
      await authAxios.post(`/api/rsos/${id}/join`);
    } catch (error) {
      console.error("Join RSO error:", error);
      throw error;
    }
  },

  // Leave RSO
  leaveRso: async (id: number): Promise<void> => {
    try {
      await authAxios.delete(`/api/rsos/${id}/leave`);
    } catch (error) {
      console.error("Leave RSO error:", error);
      throw error;
    }
  },

  // Get RSO events
  getRsoEvents: async (id: number): Promise<any[]> => {
    try {
      const response = await authAxios.get(`/api/rsos/${id}/events`);
      return response.data;
    } catch (error) {
      console.error("Get RSO events error:", error);
      throw error;
    }
  },
  // Add a member to RSO (admin function)
  addMemberToRso: async (rsoId: number, userId: number): Promise<void> => {
    try {
      await authAxios.post(`/api/admin/rsos/${rsoId}/members`, { userId });
    } catch (error) {
      console.error("Add member to RSO error:", error);
      throw error;
    }
  },

  // Remove a member from RSO (admin function)
  removeMemberFromRso: async (rsoId: number, userId: number): Promise<void> => {
    try {
      await authAxios.delete(`/api/admin/rsos/${rsoId}/members/${userId}`);
    } catch (error) {
      console.error("Remove member from RSO error:", error);
      throw error;
    }
  },
};
