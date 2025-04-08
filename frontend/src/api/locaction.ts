import { Location, LocationRequest } from "../types/location";
import { authAxios } from "./auth";

export const locationApi = {
  // Get all locations
  getAllLocations: async (): Promise<Location[]> => {
    try {
      const response = await authAxios.get("/api/locations");
      return response.data;
    } catch (error) {
      console.error("Get all locations error:", error);
      throw error;
    }
  },

  // Get location by ID
  getLocationById: async (id: number): Promise<Location> => {
    try {
      const response = await authAxios.get(`/api/locations/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get location by ID error:", error);
      throw error;
    }
  },

  // Create new location (Admin only)
  createLocation: async (locationData: LocationRequest): Promise<Location> => {
    try {
      const response = await authAxios.post(
        "/api/admin/locations",
        locationData
      );
      return response.data;
    } catch (error) {
      console.error("Create location error:", error);
      throw error;
    }
  },

  // Update location (Admin only)
  updateLocation: async (
    id: number,
    locationData: LocationRequest
  ): Promise<Location> => {
    try {
      const response = await authAxios.put(
        `/api/admin/locations/${id}`,
        locationData
      );
      return response.data;
    } catch (error) {
      console.error("Update location error:", error);
      throw error;
    }
  },

  // Delete location (Admin only)
  deleteLocation: async (id: number): Promise<void> => {
    try {
      await authAxios.delete(`/api/admin/locations/${id}`);
    } catch (error) {
      console.error("Delete location error:", error);
      throw error;
    }
  },
};
