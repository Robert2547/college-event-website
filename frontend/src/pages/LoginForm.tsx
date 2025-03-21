import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../hooks/useAuthStore";
import { authApi } from "../api/auth";
import { LoginCredentials } from "../types/auth";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  useTogglePasswordVisibility,
  validateEmail,
  validatePassword,
} from "../utils/formValidate";

const LoginForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  // Form validation errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Use password visibility hook
  const { showPassword, togglePasswordVisibility } =
    useTogglePasswordVisibility();

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });

    // Clear errors as user types
    if (name === "email") setEmailError("");
    if (name === "password") setPasswordError("");
  };

  // Validate form
  const validateForm = () => {
    const emailError = validateEmail(credentials.email);
    const passwordError = validatePassword(credentials.password);

    setEmailError(emailError);
    setPasswordError(passwordError);

    return !emailError && !passwordError;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setError("");
    setIsLoading(true);

    const loadingToast = toast.loading("Logging in...");

    try {
      // Get response from login API
      const authResponse = await authApi.login(credentials);

      // Extract token from response
      const token = authResponse.token;

      // Use token to verify and get user data
      const userData = await authApi.verifyToken(token);

      // Set auth data in the store
      setAuth(userData, token);

      // Show success message
      toast.dismiss(loadingToast);
      toast.success(`Welcome back, ${userData.firstName}!`);

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err: any) {
      toast.dismiss(loadingToast);

      // Get error message from response or use default
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        "Login failed. Please check your credentials.";

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
            Welcome back
          </h2>
          <p className="text-left text-gray-500 mb-6">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Email input */}
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
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className={`block w-full px-4 py-3 border ${
                    emailError ? "border-red-500" : "border-gray-300"
                  } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm`}
                  placeholder="Enter your email"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-500 text-left">
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 text-left"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className={`block w-full px-4 py-3 border ${
                      passwordError ? "border-red-500" : "border-gray-300"
                    } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm pr-10`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-sm text-red-500 text-left">
                    {passwordError}
                  </p>
                )}
              </div>
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
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <span className="text-gray-600 text-sm">
                Don't have an account?{" "}
              </span>
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
