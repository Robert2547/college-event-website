import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { SignUpCredentials, Role } from "../types/auth";
import { authApi } from "../api/auth";
import { useAuthStore } from "../hooks/useAuthStore";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  useTogglePasswordVisibility,
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateRequired,
} from "../utils/formValidate";

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

  // Form validation errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    passwordConfirmation: "",
    firstName: "",
    lastName: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Use password visibility hooks
  const passwordVisibility = useTogglePasswordVisibility();
  const confirmPasswordVisibility = useTogglePasswordVisibility();

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      passwordConfirmation: validatePasswordMatch(
        formData.password,
        formData.passwordConfirmation
      ),
      firstName: validateRequired(formData.firstName, "First name"),
      lastName: validateRequired(formData.lastName, "Last name"),
    };

    setErrors(newErrors);

    // Check if there are any errors
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setError("");
    setIsLoading(true);

    // Add loading toast
    const loadingToast = toast.loading("Creating your account...");

    try {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-left text-2xl font-bold text-gray-800 mb-2">
            Create an account
          </h2>
          <p className="text-left text-gray-500 mb-6">
            Fill in the details below to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 text-left mb-1"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full px-4 py-3 border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 text-left">
                  {errors.email}
                </p>
              )}
            </div>

            {/* First and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 text-left mb-1"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                  placeholder="First name"
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500 text-left">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 text-left mb-1"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                  placeholder="Last name"
                  required
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500 text-left">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Role selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 text-left mb-1"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                required
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
                <option value="SUPER_ADMIN">SUPER_ADMIN</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 text-left mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={passwordVisibility.showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-10`}
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={passwordVisibility.togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {passwordVisibility.showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 text-left">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="passwordConfirmation"
                className="block text-sm font-medium text-gray-700 text-left mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type={
                    confirmPasswordVisibility.showPassword ? "text" : "password"
                  }
                  value={formData.passwordConfirmation}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    errors.passwordConfirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-10`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={confirmPasswordVisibility.togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {confirmPasswordVisibility.showPassword ? (
                    <EyeOffIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.passwordConfirmation && (
                <p className="mt-1 text-sm text-red-500 text-left">
                  {errors.passwordConfirmation}
                </p>
              )}
            </div>

            {error && (
              <div
                className="bg-red-50 text-red-500 text-sm font-medium p-3 rounded-lg"
                role="alert"
              >
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                }`}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <span className="text-gray-600 text-sm">
                Already have an account?{" "}
              </span>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
              >
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
