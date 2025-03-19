import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "USER" | "ADMIN" | "SUPER_ADMIN";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = "USER", // Default role is USER if not specified
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Always start with authentication check
    if (!isAuthenticated) {
      setHasPermission(false);
      setIsChecking(false);
      return;
    }

    // If we're authenticated, check role permissions
    const userRole = user?.role || "USER";

    // Determine permission based on role hierarchy
    let permitted = false;
    if (requiredRole === "USER") {
      permitted = true; // All authenticated users can access USER routes
    } else if (requiredRole === "ADMIN") {
      permitted = userRole === "ADMIN" || userRole === "SUPER_ADMIN";
    } else if (requiredRole === "SUPER_ADMIN") {
      permitted = userRole === "SUPER_ADMIN";
    }

    setHasPermission(permitted);
    setIsChecking(false);
  }, [isAuthenticated, user, requiredRole]);

  if (isChecking) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPermission) {
    // Redirect to unauthorized page if user doesn't have sufficient permissions
    return <Navigate to="/unauthorized" replace />;
  }

  // User has permission, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
