export interface LoginCredentials {
  email: string;
  password: string;
}

export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface SignUpCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  passwordConfirmation: string;
  role: Role;
}
