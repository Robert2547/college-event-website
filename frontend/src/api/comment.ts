import axios from "axios";

export const getCommentsByEvent = async (eventId: number) => {
  const res = await axios.get(`/api/events/${eventId}/comments`);
  return res.data;
};

export const addComment = async (eventId: number, content: string) => {
  const res = await axios.post(`/api/events/${eventId}/comments`, { content });
  return res.data;
};

export const updateComment = async (eventId: number, commentId: number, content: string) => {
  const res = await axios.put(`/api/events/${eventId}/comments/${commentId}`, { content });
  return res.data;
};

export const deleteComment = async (eventId: number, commentId: number) => {
  const res = await axios.delete(`/api/events/${eventId}/comments/${commentId}`);
  return res.data;
};
