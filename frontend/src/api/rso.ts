import axios from "axios";

const API = "/api/rsos";

export const getAllRsos = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const joinRso = async (rsoId: number) => {
  const res = await axios.post(`${API}/join/${rsoId}`);
  return res.data;
};

export const createRso = async (rso: { name: string; description: string; memberEmails: string[] }) => {
  const res = await axios.post(API, rso);
  return res.data;
};
