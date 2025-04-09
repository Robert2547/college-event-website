import { Location } from "./location";

export type EventType = "PUBLIC" | "PRIVATE" | "RSO";

export interface Event {
  id: number;
  name: string;
  description: string;
  time: string;
  date: string;
  location: Location;
  createdBy: string;
  college: string;
  eventType: EventType;
  contactPhone: string;
  contactEmail: string;
  averageRating?: number;
  commentCount?: number;
  approved?: boolean; // For public events
  rsoId?: number; // For RSO events
}

export interface EventUpdateRequest {
  name: string;
  description: string;
  time: string;
  date: string;
  locationId: number;
  contactPhone: string;
  contactEmail: string;
}

export interface EventCreateRequest extends EventUpdateRequest {
  collegeId: number;
  eventType: EventType;
  rsoId?: number;
}

export interface EventComment {
  id: number;
  userId: number;
  content: string;
  date: string;
  time: string;
  userName: string;
}

export interface EventRating {
  eventId: number;
  averageRating: number;
  totalRatings: number;
}
