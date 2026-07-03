import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MockAuthProvider } from "./context/MockAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { mockAlerts } from "./utils/mockData";

// Page imports
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/Darshboard";
import ReportPage from "./pages/ReportPage";
import ProfilePage from "./pages/ProfilePage";

/**
 * CampConnect - App Root
 * Manages global alert state and routing.
 * Each protected page (Dashboard, Report, Profile) renders its own 3-column layout
 * with Sidebar + content + RightPanel
 */
const App = () => {
  // Alerts state lives here so both Dashboard and Report pages can share it
  const [alerts, setAlerts] = useState(mockAlerts);

  const handleNewAlert = (alert) => {
    setAlerts((prev) => [alert, ...prev]);
    console.log("[App] Alert added. Total alerts:", alerts.length + 1);
  };

  return (
    <MockAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes (with Navbar/Footer) */}
          <Route
            path="/"
            element={
              <Layout>
                <LandingPage />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <AboutPage />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <ContactPage />
              </Layout>
            }
          />
          <Route
            path="/login"
            element={
              <Layout>
                <LoginPage />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <RegisterPage />
              </Layout>
            }
          />

          {/* Protected Routes — Each page has its own 3-column shell (Sidebar + content + RightPanel) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage alerts={alerts} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportPage alerts={alerts} onSubmitAlert={handleNewAlert} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage alerts={alerts} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </MockAuthProvider>
  );
};

export default App;
