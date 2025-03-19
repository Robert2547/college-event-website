import React, { useState } from "react";
import toast from "react-hot-toast";
import { SignUpCredentials, Role } from "../types/auth";
import { authApi } from "../api/auth";
import { useNavigate } from "react-router-dom";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpCredentials>({
    email: "",
    password: "",
    passwordConfirmation: "",
    firstName: "",
    lastName: "",
    role: "USER",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add loading toast
    const loadingToast = toast.loading("Creating your account...");

    try {
      // Password match validation
      if (formData.password !== formData.passwordConfirmation) {
        toast.dismiss(loadingToast);
        toast.error("Passwords do not match");
        setError("Passwords do not match");
        return;
      }

      // Sign up
      const userData = await authApi.signUp(formData);

      // Login after successful signup
      const tokenResponse = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      // Set both user and token in the auth store
      //   setAuth(userData, tokenResponse.access_token);

      // Dismiss loading and show success
      toast.dismiss(loadingToast);
      toast.success("Account created successfully! Welcome aboard!");

      // Small delay before navigation for better UX
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      toast.dismiss(loadingToast);
      if (err.response) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          placeholder="First Name"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          placeholder="Last Name"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <select
          value={formData.role}
          onChange={(e) =>
            setFormData({ ...formData, role: e.target.value as Role })
          }
          className="w-full p-2 border rounded"
          required
        >
          <option value="user">USER</option>
          <option value="admin">ADMIN</option>
          <option value="super_admin">SUPER_ADMIN</option>
        </select>
      </div>
      <div>
        <input
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <input
          type="password"
          value={formData.passwordConfirmation}
          onChange={(e) =>
            setFormData({ ...formData, passwordConfirmation: e.target.value })
          }
          placeholder="Confirm Password"
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
        Sign Up
      </button>

      <div className="text-center">
        <span className="text-gray-600">Already have an account? </span>
        {/* <Link
          to="/login"
          className="text-blue-500 hover:text-blue-700 font-medium"
        >
          Login
        </Link> */}
      </div>
    </form>
  );
};

export default SignUpForm;
