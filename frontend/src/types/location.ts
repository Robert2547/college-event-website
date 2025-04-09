export interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface LocationRequest {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}
