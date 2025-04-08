import { authAxios } from "./auth";
import { Event, EventCreateRequest } from "../types/event";

const API = "/api/admin/events"; // 🔥 now scoped to admin

export const getAllAccessibleEvents = async () => {
  const res = await authAxios.get("/api/events");
  return res.data;
};

export const getEventsByType = async (eventType: "PUBLIC" | "PRIVATE" | "RSO") => {
  const res = await authAxios.get(`/api/events/filter/type/${eventType}`);
  return res.data;
};

export const createEvent = async (event: EventCreateRequest) => {
  const res = await authAxios.post(`/api/events`, event); // ✅ goes to /api/admin/events
  return res.data;
};

export const getEventById = async (id: number) => {
  const res = await authAxios.get(`/api/events/${id}`);
  return res.data;
};

export const getPublicEvents = async () => {
  const res = await authAxios.get("/api/events/filter/type/PUBLIC");
  return res.data;
};

export const getPrivateEvents = async () => {
  const res = await authAxios.get("/api/events/filter/type/PRIVATE");
  return res.data;
};

export const getRsoEvents = async (rsoId: number) => {
  const res = await authAxios.get(`/api/rsos/${rsoId}/events`);
  return res.data;
};
