import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
import { authApi } from "../api/auth";
import { LoginCredentials } from "../types/auth";
import toast from "react-hot-toast";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  // const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const loadingToast = toast.loading("Logging in...");

    try {
      // Get token from login
      const tokenResponse = await authApi.login(credentials);

      // Verify token and get user data
      const userData = await authApi.verifyToken(tokenResponse.access_token);

      // Set both user and token in persistent store
      // setAuth(userData, tokenResponse.access_token);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(`Welcome back, ${userData.firstName}!`);

      // Navigate after a short delay for better UX
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      const errorMessage = err.response?.data?.detail || "Login failed";
      toast.error(errorMessage);
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      {error && (
        <div className="text-red-500" role="alert">
          {error}
        </div>
      )}
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </button>

      <div className="text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <Link
          to="/signup"
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
};
