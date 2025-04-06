import axios from "axios";
import { Event, EventCreateRequest } from "../types/event";

const API = "/api/events";

export const getAllAccessibleEvents = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const getEventsByType = async (eventType: "PUBLIC" | "PRIVATE" | "RSO") => {
  const res = await axios.get(`${API}/filter/type/${eventType}`);
  return res.data;
};

export const createEvent = async (event: EventCreateRequest) => {
  const res = await axios.post(API, event);
  return res.data;
};

export const getEventById = async (id: number) => {
  const res = await axios.get(`${API}/${id}`);
  return res.data;
};

export const getPublicEvents = async () => {
  const res = await axios.get("/api/events/filter/type/PUBLIC");
  return res.data;
};

export const getPrivateEvents = async () => {
  const res = await axios.get("/api/events/filter/type/PRIVATE");
  return res.data;
};

export const getRsoEvents = async (rsoId: number) => {
  const res = await axios.get(`/api/rsos/${rsoId}/events`);
  return res.data;
};
