import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import toast from "react-hot-toast";
import { User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    toast.success("Successfully logged out");
    navigate("/login");
  };

  // Helper to determine if a link is active
  const isActive = (path: string): boolean => location.pathname === path;

  // Get navigation items based on user role
  const getNavItems = () => {
    if (!isAuthenticated || !user) return [];

    const items = [{ path: "/dashboard", label: "Dashboard", allowed: true }];

    // Add admin links if user has admin or super admin role
    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      items.push({ path: "/admin", label: "Admin", allowed: true });
    }

    // Add super admin links if user has super admin role
    if (user.role === "SUPER_ADMIN") {
      items.push({
        path: "/superAdmin",
        label: "College Management",
        allowed: true,
      });
    }

    return items.filter((item) => item.allowed);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-indigo-600 font-bold text-xl">
                College Admin
              </Link>
            </div>

            {/* Desktop navigation */}
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                {getNavItems().map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.path)
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* User profile and logout */}
          {isAuthenticated && user ? (
            <div className="flex items-center">
              <div className="hidden md:flex items-center space-x-2">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.firstName} {user.lastName}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {user.role}
                </span>
              </div>
              <div className="ml-4 flex items-center md:ml-6">
                <button
                  onClick={handleLogout}
                  className="ml-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                to="/login"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/login")
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className={`ml-3 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/signup")
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      {isAuthenticated && (
        <div className="sm:hidden border-t border-gray-200 pt-2 pb-3 space-y-1">
          {getNavItems().map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block pl-3 pr-4 py-2 text-base font-medium ${
                isActive(item.path)
                  ? "bg-indigo-50 border-l-4 border-indigo-500 text-indigo-700"
                  : "border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
