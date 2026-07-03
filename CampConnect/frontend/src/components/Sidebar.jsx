import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";
import { ALL_SECTORS } from "../utils/mockData";

/**
 * Sidebar — Persistent Left Navigation Column
 * Props: currentSector, setCurrentSector (optional for sector highlighting)
 */
const Sidebar = ({ currentSector = "", setCurrentSector = () => {}, unreadCount = 0 }) => {
  const { user, logout } = useMockAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [unreadCounts, setUnreadCounts] = useState({
    "Kakuma 1": 3,
    "Kakuma 2": 0,
    "Kakuma 3": 1,
    "Kakuma 4": 0,
    "Village 1": 2,
    "Village 2": 0,
    "Village 3": 0,
  });

  return (
    <aside className="w-64 bg-white border-r border-slate-100 p-6 hidden lg:flex flex-col justify-between min-h-screen">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">
            CampConnect
          </span>
        </div>

        {/* User Location Anchor */}
        <div className="mx-4 mb-4 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-left flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Location:</span>
            <span className="text-xs font-bold text-blue-600">{user?.location?.specificLocation?.zone ? `${currentSector || 'Kakuma 1'} (${user.location.specificLocation.zone})` : 'Kakuma 1 (Zone 3)'}</span>
          </div>
        </div>

        {/* Primary Tool Buttons */}
        <nav className="space-y-1 mb-8">
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: GridIcon,
              path: "/dashboard",
            },
            {
              id: "reports",
              label: "Create Report",
              icon: FileIcon,
              path: "/report",
            },
            {
              id: "settings",
              label: "Settings",
              icon: GearIcon,
              path: "/profile",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  navigate(item.path);
                }}
                className={`w-full flex items-center gap-3 cursor-pointer border-none transition-all ${
                  isActive
                    ? "bg-blue-600 text-white rounded-xl px-4 py-3 text-sm font-semibold shadow-md"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-xl px-4 py-3 text-sm bg-transparent"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Notifications Button */}
        <button
          onClick={() => {
            setCurrentSector("Notifications");
            navigate("/dashboard");
          }}
          className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border-none cursor-pointer text-sm ${
            currentSector === "Notifications"
              ? "bg-slate-100 text-slate-900 font-bold"
              : "text-slate-600 hover:bg-slate-50 bg-transparent"
          }`}
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white font-bold text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Camp Sectors */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3 px-1">
            Camp Sectors
          </p>
          <div className="space-y-1">
            {ALL_SECTORS.map((sector) => {
              const unread = unreadCounts[sector] || 0;
              const isActive = currentSector === sector;
              return (
                <div
                  key={sector}
                  onClick={() => {
                    setCurrentSector(sector);
                    setUnreadCounts((prev) => ({ ...prev, [sector]: 0 }));
                    navigate("/dashboard");
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${isActive ? "text-white" : "text-slate-700"}`}
                  >
                    {sector}
                  </span>
                  {unread > 0 && (
                    <span
                      className={`min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded-full px-1 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50/60 font-medium transition-all duration-200 text-sm border-none cursor-pointer bg-transparent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
        <p className="text-[10px] text-slate-400 text-center mt-3">
          CampConnect v2.0
        </p>
      </div>
    </aside>
  );
};

/* ─── Icon Components ─── */
function GridIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
function FileIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}
function GearIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  );
}

export default Sidebar;
