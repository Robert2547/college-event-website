import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthState } from "../types/auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // name of the item in the storage
    }
  )
);
