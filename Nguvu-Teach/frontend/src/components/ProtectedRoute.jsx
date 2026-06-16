// ============================================
// Protected Route Wrapper Component
// File: src/components/ProtectedRoute.jsx
// Purpose: Guards admin-only routes by verifying
// the presence of a JWT token in localStorage.
// Redirects unauthenticated users to /admin-login.
// ============================================

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // Check for authentication token in localStorage
  const token = localStorage.getItem("adminToken");

  // If token exists, render the protected children components
  if (token) {
    return children;
  }

  // If no token found, redirect to the admin login page
  return <Navigate to="/admin-login" replace />;
}

export default ProtectedRoute;
