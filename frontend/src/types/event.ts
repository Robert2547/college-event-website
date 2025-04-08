export interface Event {
  eventId?: number;
  name: string;
  description?: string;
  date: string;
  time: string;
  eventType: "PUBLIC" | "PRIVATE" | "RSO";
  locationId: number;
  contactPhone?: string;
  contactEmail?: string;
  createdBy: number;
  collegeId: number;
}


export interface EventCreateRequest {
  name: string;
  description?: string;
  date: string;
  time: string;
  eventType: "PUBLIC" | "PRIVATE" | "RSO";
  locationId: number;
  contactEmail?: string;
  contactPhone?: string;
  rsoId?: number | null;
  collegeId: number;
}
