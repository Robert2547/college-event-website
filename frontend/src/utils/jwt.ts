import { jwtDecode } from "jwt-decode";

// JWT payload
// sub: subject (user ID)
// exp: expiration time
interface JwtPayload {
  sub: string;
  exp: number;
}

// Decode JWT without validation (validation happens on the server)
export const decodeToken = (token: string): JwtPayload | null => {
  if (!token) return null;

  try {
    console.log("JwtPayload: ", jwtDecode<JwtPayload>(token));
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};
