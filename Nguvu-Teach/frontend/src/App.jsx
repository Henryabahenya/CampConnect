// ============================================
// Nguvu-Teach App Entry Point
// File: src/App.jsx
// Purpose: Multi-page routing architecture using
// react-router-dom for public and admin routes
// ============================================

import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Layout components
import Footer from "./components/common/Footer";
import Navbar from "./components/common/Navbar";

// Public section components
import GlassHero from "./components/sections/GlassHero";
import About from "./components/sections/About";
import WhatWeDo from "./components/sections/WhatWeDo";
import Courses from "./components/sections/Courses";
import Events from "./components/sections/Events";
import FAQ from "./components/sections/FAQ";
import Apply from "./components/sections/Apply";
import Contact from "./components/sections/Contact";
import ContactMap from "./components/sections/ContactMap";

// Admin components
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

// Global widgets
import Chatbot from "./components/Chatbot";

// ============================================
// Landing Page Component (Home)
// ============================================
function LandingPage() {
  const [events, setEvents] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [courses, setCourses] = useState([]);

  // Force scroll to #hero on every mount/reload
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(null, null, window.location.pathname);
    }
    const heroSection = document.getElementById("hero");
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: "auto", block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen bg-[#f8fafc] text-slate-900 scroll-smooth selection:bg-[#8A0030]/20 selection:text-[#8A0030]">
        <GlassHero />
        <main>
          <About />
          <WhatWeDo />
          <Courses data={courses.length ? courses : undefined} />
          <Events data={events.length ? events : undefined} />
          <FAQ data={faqs.length ? faqs : undefined} />
          <Apply />
          <Contact />
          <ContactMap />
        </main>
        <Footer />
      </div>
    </>
  );
}

// ============================================
// App Router Configuration
// ============================================
function App() {
  return (
    <>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin Login Page */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* Protected Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Global Floating Chatbot — visible on all pages */}
      <Chatbot />
    </>
  );
}

export default App;
