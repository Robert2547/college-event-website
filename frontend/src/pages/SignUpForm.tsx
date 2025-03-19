import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { SignUpCredentials, Role } from "../types/auth";
import { authApi } from "../api/auth";
import { useAuthStore } from "../hooks/useAuthStore";

const SignUpForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState<SignUpCredentials>({
    email: "",
    password: "",
    passwordConfirmation: "",
    firstName: "",
    lastName: "",
    role: "USER",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Add loading toast
    const loadingToast = toast.loading("Creating your account...");

    try {
      // Password match validation
      if (formData.password !== formData.passwordConfirmation) {
        toast.dismiss(loadingToast);
        toast.error("Passwords do not match");
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Sign up
      const authResponse = await authApi.signUp(formData);

      // Extract token from response
      const token = authResponse.token;

      // Verify token to get user data
      const userData = await authApi.verifyToken(token);

      // Set auth data in store
      setAuth(userData, token);

      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success("Account created successfully! Welcome aboard!");

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      toast.dismiss(loadingToast);
      // Get error message from response or use default
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to create account. Please try again.";

      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder="First Name"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                id="role"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value as Role })
                }
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="passwordConfirmation" className="sr-only">
                Confirm Password
              </label>
              <input
                id="passwordConfirmation"
                type="password"
                value={formData.passwordConfirmation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    passwordConfirmation: e.target.value,
                  })
                }
                placeholder="Confirm Password"
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm font-medium" role="alert">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              }`}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>

          <div className="text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;
