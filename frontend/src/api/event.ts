import {
  Event,
  EventCreateRequest,
  EventUpdateRequest,
  EventComment,
} from "../types/event";
import { authAxios } from "./auth";

export const eventApi = {
  getPrivateEvents: async () => {
    const res = await authAxios.get("/api/events/filter/type/PRIVATE");
    return res.data;
  },

  getRsoEvents: async (rsoId: number) => {
    const res = await authAxios.get(`/api/rsos/${rsoId}/events`);
    return res.data;
  },

  getPublicEvents: async () => {
    const res = await authAxios.get("/api/events/filter/type/PUBLIC");
    return res.data;
  },

  getAllEvents: async (): Promise<Event[]> => {
    try {
      const response = await authAxios.get("/api/events");
      return response.data;
    } catch (error) {
      console.error("Get all events error:", error);
      throw error;
    }
  },

  getEventById: async (id: number): Promise<Event> => {
    try {
      const response = await authAxios.get(`/api/events/${id}`);
      return response.data;
    } catch (error) {
      console.error("Get event by ID error:", error);
      throw error;
    }
  },

  // Event CRUD operations
  createEvent: async (eventData: EventCreateRequest): Promise<Event> => {
    try {
      const response = await authAxios.post("/api/events", eventData);
      return response.data;
    } catch (error) {
      console.error("Create event error:", error);
      throw error;
    }
  },

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

  deleteEvent: async (id: number): Promise<void> => {
    try {
      await authAxios.delete(`/api/events/${id}`);
    } catch (error) {
      console.error("Delete event error:", error);
      throw error;
    }
  },

  // Comment operations
  getEventComments: async (eventId: number): Promise<EventComment[]> => {
    try {
      const response = await authAxios.get(`/api/events/${eventId}/comments`);
      return response.data;
    } catch (error) {
      console.error("Get event comments error:", error);
      throw error;
    }
  },

  addComment: async (
    eventId: number,
    content: string
  ): Promise<EventComment> => {
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

  updateComment: async (
    eventId: number,
    commentId: number,
    content: string
  ): Promise<EventComment> => {
    try {
      const response = await authAxios.put(
        `/api/events/${eventId}/comments/${commentId}`,
        {
          content,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update comment error:", error);
      throw error;
    }
  },

  deleteComment: async (eventId: number, commentId: number): Promise<void> => {
    try {
      await authAxios.delete(`/api/events/${eventId}/comments/${commentId}`);
    } catch (error) {
      console.error("Delete comment error:", error);
      throw error;
    }
  },

  // Rating operations
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
