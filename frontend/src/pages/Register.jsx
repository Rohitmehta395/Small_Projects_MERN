import React, { useState } from "react";
import { registerAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const credentials = {
        name,
        email,
        password,
      };
      const { user, token } = await registerAPI(credentials);
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || "Registration failed.");
        console.error("Backend error:", error.response.data);
      } else if (error.request) {
        setErrorMessage("Server is not responding. Please try again later.");
        console.error("No response:", error.request);
      } else {
        setErrorMessage(error.message);
        console.error("Error:", error.message);
      }
    }
  };

  return (
    // 1. Full screen background wrapper to center the card
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* 2. The Card Container */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to get started with our platform
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="johndoe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors duration-200">
            Sign Up
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
