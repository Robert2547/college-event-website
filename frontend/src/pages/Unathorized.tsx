import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const goBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          {/* Lock icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>

          <div className="p-4 bg-red-50 rounded-lg mb-6">
            <p className="text-center text-red-600 font-medium">
              You don't have permission to access this page
            </p>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-center">
              {user ? (
                <>
                  Your current role{" "}
                  <span className="font-semibold">{user.role}</span> doesn't
                  have sufficient permissions. Please contact an administrator
                  if you need access.
                </>
              ) : (
                <>
                  You need to be logged in with appropriate permissions to view
                  this content.
                </>
              )}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={goBack}
              className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Go back to dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
