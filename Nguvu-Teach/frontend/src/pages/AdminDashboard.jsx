// ============================================
// Admin Dashboard — Master Control Panel
// File: src/pages/AdminDashboard.jsx
// Purpose: Administrative CRUD interface for managing
// Tracks, Courses, and Events with JWT-authenticated
// API calls through apiClient
// ============================================

import { useState, useEffect } from "react";
import apiClient from "../api/client";
import AdminLogin from "../components/AdminLogin";

// ============================================
// Modal Form Component — Reusable Create/Edit Modal
// ============================================
function ModalForm({ isOpen, onClose, title, fields, onSubmit, initialData }) {
  const [formData, setFormData] = useState({});

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Reset to empty for new entries
      const empty = {};
      fields.forEach((f) => (empty[f.name] = ""));
      setFormData(empty);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-black text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-black tracking-wide uppercase text-slate-600 mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200 resize-none"
                  placeholder={field.placeholder || ""}
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200"
                >
                  <option value="">Select...</option>
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200"
                  placeholder={field.placeholder || ""}
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl text-white font-bold bg-[#8A0030] hover:bg-[#680024] transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {initialData ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-slate-700 font-bold bg-slate-100 hover:bg-slate-200 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================
// Main Admin Dashboard Component
// ============================================
function AdminDashboard() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Active tab state
  const [activeTab, setActiveTab] = useState("tracks");

  // Data states for each collection
  const [tracks, setTracks] = useState([]);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Status messages
  const [statusMsg, setStatusMsg] = useState("");

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data whenever authenticated or tab changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  // ============================================
  // Data Fetching
  // ============================================
  const fetchData = async () => {
    try {
      if (activeTab === "tracks") {
        const res = await apiClient.get("/api/tracks");
        setTracks(res.data);
      } else if (activeTab === "courses") {
        const res = await apiClient.get("/api/courses");
        setCourses(res.data);
      } else if (activeTab === "events") {
        const res = await apiClient.get("/api/events");
        setEvents(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // ============================================
  // CRUD Operations
  // ============================================
  const handleCreate = async (formData) => {
    try {
      await apiClient.post(`/api/${activeTab}`, formData);
      setModalOpen(false);
      setEditingItem(null);
      showStatus("Item created successfully!");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create item");
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await apiClient.put(`/api/${activeTab}/${editingItem._id}`, formData);
      setModalOpen(false);
      setEditingItem(null);
      showStatus("Item updated successfully!");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update item");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiClient.delete(`/api/${activeTab}/${id}`);
      showStatus("Item deleted successfully!");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete item");
    }
  };

  // ============================================
  // Helpers
  // ============================================
  const showStatus = (msg) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsAuthenticated(false);
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  // ============================================
  // Field Definitions for Each Collection
  // ============================================
  const fieldDefs = {
    tracks: [
      {
        name: "title",
        label: "Title",
        required: true,
        placeholder: "Track title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Brief description",
      },
      {
        name: "iconIdentifier",
        label: "Icon Identifier",
        required: true,
        placeholder: "Globe, Code, Cpu, Monitor, Megaphone, Palette",
      },
    ],
    courses: [
      {
        name: "title",
        label: "Title",
        required: true,
        placeholder: "Course title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Course description",
      },
      {
        name: "level",
        label: "Level",
        type: "select",
        required: true,
        options: ["Beginner", "Intermediate", "All Levels"],
      },
      {
        name: "duration",
        label: "Duration",
        required: true,
        placeholder: "e.g., 8 Weeks",
      },
    ],
    events: [
      {
        name: "title",
        label: "Title",
        required: true,
        placeholder: "Event title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Event description",
      },
      { name: "eventDate", label: "Event Date", type: "date", required: true },
    ],
  };

  // Get current data based on active tab
  const getCurrentData = () => {
    if (activeTab === "tracks") return tracks;
    if (activeTab === "courses") return courses;
    if (activeTab === "events") return events;
    return [];
  };

  // ============================================
  // Render: Login Gate
  // ============================================
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // ============================================
  // Render: Dashboard
  // ============================================
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-900 tracking-tight">
          <span className="text-[#8A0030]">Nguvu-Teach</span> Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-[#8A0030] border border-slate-200 rounded-xl hover:border-[#8A0030]/30 transition-all duration-200"
        >
          Sign Out
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Status Message Banner */}
        {statusMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-6 py-3 rounded-xl text-sm font-bold text-center shadow-sm">
            ✅ {statusMsg}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          {[
            { key: "tracks", label: "Manage Tracks" },
            { key: "courses", label: "Manage Courses" },
            { key: "events", label: "Manage Events" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-[#8A0030] text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-[#8A0030]/30 hover:text-[#8A0030]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800 capitalize">
            {activeTab} ({getCurrentData().length})
          </h2>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl text-white font-bold bg-[#205E7A] hover:bg-[#184a61] transition-all duration-300 shadow-sm hover:shadow-md text-sm"
          >
            + Add New
          </button>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
          {getCurrentData().length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              No items found. Click "Add New" to create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {getCurrentData().map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors duration-150"
                >
                  {/* Item Info */}
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {item.description}
                    </p>
                    {/* Meta badges */}
                    <div className="flex gap-2 mt-2">
                      {item.level && (
                        <span className="text-xs bg-[#8A0030]/10 text-[#8A0030] px-2 py-0.5 rounded-full font-medium">
                          {item.level}
                        </span>
                      )}
                      {item.duration && (
                        <span className="text-xs bg-[#205E7A]/10 text-[#205E7A] px-2 py-0.5 rounded-full font-medium">
                          {item.duration}
                        </span>
                      )}
                      {item.eventDate && (
                        <span className="text-xs bg-[#205E7A]/10 text-[#205E7A] px-2 py-0.5 rounded-full font-medium">
                          {new Date(item.eventDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      )}
                      {item.iconIdentifier && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          {item.iconIdentifier}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEditModal(item)}
                      className="px-3 py-1.5 text-xs font-bold text-[#205E7A] bg-[#205E7A]/10 rounded-lg hover:bg-[#205E7A]/20 transition-colors duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <ModalForm
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        title={
          editingItem
            ? `Edit ${activeTab.slice(0, -1)}`
            : `Add New ${activeTab.slice(0, -1)}`
        }
        fields={fieldDefs[activeTab]}
        onSubmit={editingItem ? handleUpdate : handleCreate}
        initialData={editingItem}
      />
    </div>
  );
}

export default AdminDashboard;
