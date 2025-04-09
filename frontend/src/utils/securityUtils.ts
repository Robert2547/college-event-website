import { useAuthStore } from "../hooks/useAuthStore";

export const securityUtils = {
  isAdmin: () => {
    const { user } = useAuthStore.getState();
    return user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  },

  isSuperAdmin: () => {
    const { user } = useAuthStore.getState();
    return user?.role === "SUPER_ADMIN";
  },
};
