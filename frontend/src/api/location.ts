import { authAxios } from "./auth";

export interface LocationCreateRequest {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

export const createLocation = async (location: LocationCreateRequest) => {
  const res = await authAxios.post("/api/admin/locations", location);
  return res.data;
};
