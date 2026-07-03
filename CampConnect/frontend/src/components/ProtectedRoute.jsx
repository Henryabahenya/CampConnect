import { Navigate } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";

/**
 * CampConnect - Protected Route Guard
 * Redirects unauthenticated users to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useMockAuth();

  if (!isAuthenticated) {
    console.log("[ProtectedRoute] Access denied - redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
