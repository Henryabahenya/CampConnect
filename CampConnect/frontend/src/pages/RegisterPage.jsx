import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * CampConnect - Registration Page
 * Professional multi-section form with hierarchical camp location selectors.
 * Uses backend API for user registration with phone validation.
 */
const RegisterPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    campSystem: "",
    sector: "",
    zone: "",
    block: "",
    village: "",
    neighborhood: "",
    compound: "",
    houseNumber: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // Reset dependent fields when camp system changes
      if (name === "campSystem") {
        updated.sector = "";
        updated.zone = "";
        updated.block = "";
        updated.village = "";
        updated.neighborhood = "";
        updated.compound = "";
        updated.houseNumber = "";
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Frontend validation
    if (!form.username || !form.email || !form.phone || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+254\s?7\d{8}$/;
    if (!phoneRegex.test(form.phone)) {
      setError(
        "Phone number must start with +254 7 followed by 8 digits (e.g., +254 768 407 749)",
      );
      return;
    }

    if (!form.campSystem) {
      setError("Please select your camp system.");
      return;
    }

    setLoading(true);

    try {
      const apiBase =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          phone: form.phone,
          password: form.password,
          location: {
            campSystem: form.campSystem,
            sector: form.sector || "None",
            specificLocation: {
              zone: form.zone,
              block: form.block,
              neighborhood: form.neighborhood,
              compound: form.compound,
              houseNumber: form.houseNumber,
            },
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      // Store token and user
      localStorage.setItem("campconnect_token", data.token);
      localStorage.setItem("campconnect_user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      console.error("Register error:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const isKakuma = form.campSystem === "Kakuma";
  const isKalobeyei = form.campSystem === "Kalobeyei";

  return (
    <div className="flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Register to access the CampConnect community alert system.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          {/* Section 1 — Personal Information */}
          <div className="px-6 pt-6 pb-5 border-b border-gray-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Personal Information
            </h3>
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Username <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Choose a username"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:bg-gray-100"
                />
              </div>

              {/* Email & Phone — 2-col grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="you@example.com"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="+254 768 407 749"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Passwords — 2-col grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Min. 6 characters"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Re-enter password"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2 — Camp Location */}
          <div className="px-6 pt-5 pb-5 border-b border-gray-100">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Camp Location
            </h3>
            <div className="space-y-4">
              {/* Camp System Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Camp System <span className="text-red-400">*</span>
                </label>
                <select
                  name="campSystem"
                  value={form.campSystem}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                >
                  <option value="">Select camp system</option>
                  <option value="Kakuma">Kakuma Resettlement</option>
                  <option value="Kalobeyei">Kalobeyei Settlement</option>
                  <option value="Outside Camp">Outside Camp</option>
                </select>
              </div>

              {/* Kakuma — Sector + Zone/Block */}
              {isKakuma && (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Sector
                    </label>
                    <select
                      name="sector"
                      value={form.sector}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                    >
                      <option value="">Select sector</option>
                      <option value="Kakuma 1">Kakuma 1</option>
                      <option value="Kakuma 2">Kakuma 2</option>
                      <option value="Kakuma 3">Kakuma 3</option>
                      <option value="Kakuma 4">Kakuma 4</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Zone
                      </label>
                      <select
                        name="zone"
                        value={form.zone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                      >
                        <option value="">Select Zone</option>
                        <option value="Zone 1">Zone 1</option>
                        <option value="Zone 2">Zone 2</option>
                        <option value="Zone 3">Zone 3</option>
                        <option value="Zone 4">Zone 4</option>
                        <option value="Zone 5">Zone 5</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Block
                      </label>
                      <input
                        type="text"
                        name="block"
                        value={form.block}
                        onChange={handleChange}
                        placeholder="e.g. Block B"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Kalobeyei — Village + Neighborhood/Compound/House */}
              {isKalobeyei && (
                <div className="space-y-4 pt-1">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Village
                    </label>
                    <select
                      name="sector"
                      value={form.sector}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                    >
                      <option value="">Select village</option>
                      <option value="Village 1">Village 1</option>
                      <option value="Village 2">Village 2</option>
                      <option value="Village 3">Village 3</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Neighborhood
                      </label>
                      <input
                        type="text"
                        name="neighborhood"
                        value={form.neighborhood}
                        onChange={handleChange}
                        placeholder="Name"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Compound
                      </label>
                      <input
                        type="text"
                        name="compound"
                        value={form.compound}
                        onChange={handleChange}
                        placeholder="ID"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        House No.
                      </label>
                      <input
                        type="text"
                        name="houseNumber"
                        value={form.houseNumber}
                        onChange={handleChange}
                        placeholder="No."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="px-6 py-5">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </form>

        {/* Footer link */}
        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 no-underline hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
