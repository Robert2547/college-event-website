import { useState } from "react";

// Function to toggle password visibility
export const useTogglePasswordVisibility = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return { showPassword, togglePasswordVisibility };
};

// Check if email is valid
export const validateEmail = (email: string): string => {
  if (!email) return "Email is required";
  if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address";
  return "";
};

// Check if password is valid
export const validatePassword = (password: string): string => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

// Check if password and confirm password match
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};

// Check if field is required
export const validateRequired = (value: string, fieldName: string): string => {
  if (!value) return `${fieldName} is required`;
  return "";
};
