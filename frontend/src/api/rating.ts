import axios from "axios";

export const getEventRating = async (eventId: number) => {
  const res = await axios.get(`/api/events/${eventId}/ratings`);
  return res.data;
};

export const submitRating = async (eventId: number, rating: number) => {
  const res = await axios.post(`/api/events/${eventId}/ratings`, { rating });
  return res.data;
};
