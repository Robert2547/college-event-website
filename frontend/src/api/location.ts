import axios from "axios";

export interface LocationCreateRequest {
  name: string;
  latitude: number;
  longitude: number;
  address: string;
}

export const createLocation = async (location: LocationCreateRequest) => {
  const res = await axios.post("/api/locations", location);
  return res.data; // will include locationId
};
