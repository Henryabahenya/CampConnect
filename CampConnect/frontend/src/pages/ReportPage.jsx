import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";
import { ALL_SECTORS, mockAlerts } from "../utils/mockData";
import Sidebar from "../components/Sidebar";
import CenterColumnFooter from "../components/CenterColumnFooter";

/**
 * CampConnect — Report Infrastructure Disruption
 * 3-Column Layout: Left sidebar + Center form + Right panel
 */
const ReportPage = ({ onSubmitAlert, alerts: externalAlerts }) => {
  const alerts = externalAlerts || mockAlerts;
  const { user } = useMockAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Water",
    urgency: "Medium",
    targetSector: user?.location?.sector || ALL_SECTORS[0],
    location: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [customCategory, setCustomCategory] = useState("");

  const isOtherCategorySelected = form.category === "Other";

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Buffer the raw File object for multipart FormData transmission
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.location) return;

    const newAlert = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      category: isOtherCategorySelected
        ? customCategory.trim() || "Other"
        : form.category,
      urgency: form.urgency,
      targetSector: form.targetSector,
      locationDetails: form.location,
      image: imagePreview || null,
      postedBy: {
        username: user?.username || "Anonymous",
        profilePicture: user?.profilePicture || null,
      },
      upvotes: 0,
      status: "Active",
      comments: [],
      createdAt: new Date().toISOString(),
    };

    // Production path: multipart/form-data with buffered File
    // const payload = new FormData();
    // if (imageFile) payload.append('image', imageFile);
    // payload.append('data', JSON.stringify(newAlert));

    onSubmitAlert(newAlert);
    setSubmitted(true);
    setTimeout(() => navigate("/dashboard"), 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans flex text-slate-800">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Center Column */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="mx-auto max-w-3xl">
          {/* ═══ Page Header ═══ */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Document Local Infrastructure Disruption
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-xl">
              Complete the fields below to formally log an infrastructure or
              safety concern within your operational sector. All submissions are
              geo-tagged and routed to sector coordinators.
            </p>
          </div>

          {submitted ? (
            <div className="bg-blue-600 rounded-lg p-10 text-center">
              <p className="text-lg font-semibold text-white">
                Report submitted successfully.
              </p>
              <p className="text-sm text-blue-100 mt-1">
                Redirecting to operations feed...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ═══ Section: Classification ═══ */}
              <section className="bg-white border border-[#E2E8F0] rounded-lg p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
                  Classification
                </h2>

                {/* Row 1: Title + Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Report Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      placeholder="e.g., Main pipeline rupture at Block C"
                      required
                      className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Category
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                    >
                      <option value="Water">Water</option>
                      <option value="Power">Power</option>
                      <option value="Roads">Roads</option>
                      <option value="Safety">Safety</option>
                      <option value="Other">Other (Specify)</option>
                    </select>
                    {isOtherCategorySelected && (
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="Please specify the issue category"
                        className="mt-2 w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                      />
                    )}
                  </div>
                </div>

                {/* Row 2: Target Sector + Urgency */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Target Camp Sector
                    </label>
                    <select
                      name="targetSector"
                      value={form.targetSector}
                      onChange={handleChange}
                      className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                    >
                      {ALL_SECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Urgency Level
                    </label>
                    <select
                      name="urgency"
                      value={form.urgency}
                      onChange={handleChange}
                      className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* ═══ Section: Narrative ═══ */}
              <section className="bg-white border border-[#E2E8F0] rounded-lg p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
                  Narrative Detail
                </h2>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Precise Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Zone, Block, or landmark reference"
                    required
                    className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description of Disruption
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Provide a factual account of the infrastructure disruption, including time of onset and affected population..."
                    rows={5}
                    required
                    className="w-full rounded border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none transition resize-vertical"
                  />
                </div>
              </section>

              {/* ═══ Section: Photographic Evidence ═══ */}
              <section className="bg-white border border-[#E2E8F0] rounded-lg p-6">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-5">
                  Photographic Evidence
                </h2>

                {imagePreview ? (
                  <div>
                    <div className="w-full h-48 rounded bg-slate-100 border border-[#E2E8F0] overflow-hidden flex items-center justify-center">
                      <img
                        src={imagePreview}
                        alt="Evidence preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-600 truncate max-w-[65%]">
                        {imageFile?.name}
                        <span className="ml-2 text-slate-400">
                          ({(imageFile?.size / 1024).toFixed(1)} KB)
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-transparent border-none cursor-pointer transition"
                      >
                        Remove file
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 rounded border-2 border-dashed border-blue-300 bg-blue-50 cursor-pointer hover:bg-blue-100 transition">
                    <p className="text-sm text-blue-600 font-medium">
                      Attach photographic documentation
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      PNG, JPG — max 10 MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                )}
              </section>

              {/* ═══ Submit ═══ */}
              <button
                type="submit"
                className="w-full rounded bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition cursor-pointer"
              >
                Submit Disruption Report
              </button>
            </form>
          )}
        </div>

        {/* Center Column Footer */}
        <CenterColumnFooter />
      </main>
    </div>
  );
};

export default ReportPage;
