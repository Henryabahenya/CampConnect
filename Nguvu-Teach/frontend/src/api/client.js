// ============================================
// Nguvu-Teach Centralized Axios API Client
// File: src/api/client.js
// Purpose: Custom Axios instance that routes all
// network traffic through environment-configured
// base URLs for dev/production deployments.
// Automatically attaches JWT tokens for admin requests.
//
// BASE URL LOGIC:
// - In development: VITE_API_BASE_URL = "http://localhost:5000"
//   (separate Vite dev server talks to backend on another port)
// - In production builds served from Express: VITE_API_BASE_URL is
//   empty or omitted, resulting in baseURL = '' which triggers
//   relative-path requests (e.g., '/api/courses'). The browser
//   automatically routes these to the same host:port serving the page.
// ============================================

import axios from "axios";

// Resolve the base URL from Vite env variables.
// If VITE_API_BASE_URL is undefined, empty, or missing during build,
// default to '' so all requests become relative to the serving origin.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// ============================================
// Request Interceptor — Auto-attach JWT Token
// ============================================
// Before every request, check if a token exists in localStorage.
// If it does, attach it as a Bearer token in the Authorization header.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
