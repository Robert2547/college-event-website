export interface College {
  id: number;
  name: string;
  location: string;
  description: string;
  createdBy: string;
}

export interface CollegeRequest {
  name: string;
  location: string;
  description: string;
}
