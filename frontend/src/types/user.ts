export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  college?: {
    id: number;
    name: string;
  };
}
