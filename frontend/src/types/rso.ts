export type RsoStatus = "ACTIVE" | "INACTIVE";

export interface Rso {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  status: RsoStatus;
  adminId: number;
  collegeId: number;
  college?: string;
}

export interface RsoRequest {
  name: string;
  description: string;
  college: {
    id: number;
  }
}

export interface RsoMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  joinDate: string;
}
