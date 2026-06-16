// ============================================
// Admin Login Component
// File: src/components/AdminLogin.jsx
// Purpose: Secure login interface for admin portal
// ============================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";

function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission — authenticate with backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await apiClient.post("/api/auth/login", {
        username,
        password,
      });

      // Store JWT token securely in localStorage
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("adminUser", JSON.stringify(response.data.admin));

      // Notify parent component of successful login (if used as embedded)
      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }

      // Redirect to the admin dashboard
      navigate("/admin-dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Nguvu-Teach Admin
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Sign in to access the management dashboard
          </p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-sm space-y-5"
        >
          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* Username Field */}
          <div>
            <label
              htmlFor="admin-username"
              className="block text-xs font-black tracking-wide uppercase text-slate-600 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="admin-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200"
              placeholder="Enter admin username"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-black tracking-wide uppercase text-slate-600 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200"
              placeholder="Enter password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl text-white font-bold bg-[#8A0030] hover:bg-[#680024] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
