import { Event, EventCreateRequest, EventUpdateRequest } from "../types/event";
import { authAxios } from "./auth";

export const eventApi = {
  // Get private events
  getPrivateEvents: async () => {
    const res = await authAxios.get("/api/events/filter/type/PRIVATE");
    return res.data;
  },

  // Get RSO events
  getRsoEvents: async (rsoId: number) => {
    const res = await authAxios.get(`/api/rsos/${rsoId}/events`);
    return res.data;
  },
  // Get public events
  getPublicEvents: async () => {
    const res = await authAxios.get("/api/events/filter/type/PUBLIC");
    return res.data;
  },
  // Get all events accessible to the current user
  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await authAxios.get("/api/events");
      return response.data;
    } catch (error) {
      console.error("Get all events error:", error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id: number): Promise<Event> => {
    try {
      const response = await authAxios.get(`/api/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get event by ID error:", error);
      throw error;
    }
  },

  // Create a new event (Admin only)
  createEvent: async (eventData: EventCreateRequest): Promise<Event> => {
    try {
      const response = await authAxios.post("/api/events", eventData);
      return response.data;
    } catch (error) {
      console.error("Create event error:", error);
      throw error;
    }
  },

  // Create RSO event (Admin only)
  createRsoEvent: async (
    rsoId: number,
    eventData: EventCreateRequest
  ): Promise<Event> => {
    try {
      const response = await authAxios.post(
        `/api/rsos/${rsoId}/events`,
        eventData
      );
      return response.data;
    } catch (error) {
      console.error("Create RSO event error:", error);
      throw error;
    }
  },

  // Update event (Admin only)
  updateEvent: async (
    id: number,
    eventData: EventUpdateRequest
  ): Promise<Event> => {
    try {
      const response = await authAxios.put(`/api/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error("Update event error:", error);
      throw error;
    }
  },

  // Delete event (Admin only)
  deleteEvent: async (id: number): Promise<void> => {
    try {
      await authAxios.delete(`/api/events/${id}`);
    } catch (error) {
      console.error("Delete event error:", error);
      throw error;
    }
  },

  // Add comment to event
  addComment: async (eventId: number, content: string): Promise<any> => {
    try {
      const response = await authAxios.post(`/api/events/${eventId}/comments`, {
        content,
      });
      return response.data;
    } catch (error) {
      console.error("Add comment error:", error);
      throw error;
    }
  },

  // Rate event
  rateEvent: async (eventId: number, rating: number): Promise<any> => {
    try {
      const response = await authAxios.post(`/api/events/${eventId}/ratings`, {
        rating,
      });
      return response.data;
    } catch (error) {
      console.error("Rate event error:", error);
      throw error;
    }
  },

  // Get event comments
  getEventComments: async (eventId: number): Promise<any[]> => {
    try {
      const response = await authAxios.get(`/api/events/${eventId}/comments`);
      return response.data;
    } catch (error) {
      console.error("Get event comments error:", error);
      throw error;
    }
  },

  // Get event rating
  getEventRating: async (eventId: number): Promise<any> => {
    try {
      const response = await authAxios.get(`/api/events/${eventId}/ratings`);
      return response.data;
    } catch (error) {
      console.error("Get event rating error:", error);
      throw error;
    }
  },
};
