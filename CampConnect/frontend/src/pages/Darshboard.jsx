import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";
import { ALL_SECTORS, mockAlerts } from "../utils/mockData";
import PostCard from "../components/PostCard";
import Sidebar from "../components/Sidebar";
import CenterColumnFooter from "../components/CenterColumnFooter";

/**
 * CampConnect — Premium 3-Column Dashboard Layout
 * Left sidebar · Center main view · Right analytics panel
 */
const Darshboard = ({ alerts: externalAlerts }) => {
  const { user } = useMockAuth();
  const currentUser = user;
  const navigate = useNavigate();
  const alerts = externalAlerts || mockAlerts;

  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSector, setCurrentSector] = useState("Notifications");
  const [zoomedAlert, setZoomedAlert] = useState(null);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'post', sector: 'Kakuma 1', targetPostId: '1', message: 'New info posted in Kakuma 1: Water Point Breakdown at Block C', time: '5m ago', read: false },
    { id: 2, type: 'mention', sector: 'Kakuma 1', targetPostId: '3', message: 'You were tagged in a comment on Security Alert', time: '1h ago', read: false },
    { id: 3, type: 'post', sector: 'Village 1', targetPostId: '4', message: 'Food Distribution update posted in Village 1', time: '3h ago', read: true },
    { id: 4, type: 'mention', sector: 'Kakuma 3', targetPostId: '5', message: 'James O. mentioned you in Flooding report', time: '6h ago', read: true },
    { id: 5, type: 'post', sector: 'Kakuma 1', targetPostId: '6', message: 'Dr. Lena W. posted a new Health update', time: '12h ago', read: true },
  ]);
  const [unreadCounts, setUnreadCounts] = useState({
    "Kakuma 1": 3,
    "Kakuma 2": 0,
    "Kakuma 3": 1,
    "Kakuma 4": 0,
    "Village 1": 2,
    "Village 2": 0,
    "Village 3": 0,
  });
  const [seenPostIds, setSeenPostIds] = useState([]);

  // Sector setup progress (derived from user profile completeness)
  const progressPercentage = (() => {
    let score = 0;
    if (user?.username) score += 20;
    if (user?.location?.sector) score += 20;
    if (user?.location?.specificLocation?.zone) score += 20;
    if (user?.location?.specificLocation?.block) score += 20;
    if (user?.profilePicture) score += 20;
    return score;
  })();

  // Filter alerts based on current view + search
  const sectorAlerts =
    currentSector === "Notifications"
      ? []
      : alerts.filter((a) => a.targetSector === currentSector);

  const filteredAlerts = searchQuery.trim()
    ? sectorAlerts.filter((a) => {
        const q = searchQuery.toLowerCase();
        return (
          a.title?.toLowerCase().includes(q) ||
          a.description?.toLowerCase().includes(q) ||
          a.category?.toLowerCase().includes(q) ||
          a.targetSector?.toLowerCase().includes(q)
        );
      })
    : sectorAlerts;

  const urgentAlerts = alerts.filter((a) => a.urgency === "High");

  // Computed count for the blue banner
  const urgentReportsCount = filteredAlerts.filter((a) => a.urgency === "High").length;

  // Latest urgent post for zoomed modal view
  const latestUrgentPost = filteredAlerts.filter((a) => a.urgency === "High")[0] || null;

  // Primary alert info: most urgent or newest post in sector
  const primaryAlertInfo = latestUrgentPost || filteredAlerts[0] || null;

  // Scroll-to-urgent handler: smooth-scroll to the first urgent post card and flash-highlight it
  const scrollToUrgentPost = () => {
    const alertCard = document.querySelector('[data-priority="urgent"]');
    if (alertCard) {
      alertCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      alertCard.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
      setTimeout(() => alertCard.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2'), 2000);
    }
  };

  // Deep-link notification click handler
  const handleNotificationClick = (notif) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    // Switch to the correct sector
    setCurrentSector(notif.sector);
    // Scroll to the specific target post after view renders
    setTimeout(() => {
      const element = document.getElementById(`post-${notif.targetPostId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
        setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2'), 2000);
      }
    }, 500);
  };

  // Compute unread notification count
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark all notifications as read when user leaves the Notifications tab
  useEffect(() => {
    if (currentSector !== 'Notifications' && currentSector !== undefined) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    }
  }, [currentSector]);

  // Mark sector posts as seen when user enters a sector, clear badge on leave
  useEffect(() => {
    if (currentSector && currentSector !== 'Notifications' && alerts.length > 0) {
      const activeSectorPostIds = alerts
        .filter((p) => p.targetSector === currentSector)
        .map((p) => p.id);

      setSeenPostIds((prev) => [...new Set([...prev, ...activeSectorPostIds])]);
      setUnreadCounts((prev) => ({ ...prev, [currentSector]: 0 }));
    }
  }, [currentSector, alerts]);

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans flex text-slate-800">
      {/* Left Sidebar */}
      <Sidebar
        currentSector={currentSector}
        setCurrentSector={setCurrentSector}
        unreadCount={unreadCount}
      />

      {/* Center Column */}
      <main
        className={`flex-1 p-8 overflow-y-auto transition-all duration-500 ${currentSector === "Notifications" ? "bg-white min-h-screen flex flex-col" : "max-h-screen"}`}
      >
        {/* ── Top Bar: Search Field ── */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-xl">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search the info that you preferred"
              className="w-full bg-white border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => navigate("/report")}
            className="px-4 py-2.5 bg-blue-600 text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition shadow-sm shrink-0 border-none cursor-pointer"
          >
            + New Report
          </button>
        </div>

        {/* ══════════════════════════════════════════════════════════
            CONDITIONAL CENTER CONTENT BASED ON currentSector
        ══════════════════════════════════════════════════════════ */}

        {currentSector === "Notifications" ? (
          /* ─── NOTIFICATIONS CENTER VIEW ─── */
          <>
            <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto mt-6 text-left">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Notifications</h2>
              <p className="text-xs text-slate-400 mb-4">{notifications.filter(n => !n.read).length} unread</p>

              {notifications.map(notif => {
                const isUnread = !notif.read;

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (!isUnread) return;

                      // Precise state swap: update ONLY this notification
                      setNotifications(prev =>
                        prev.map(n => n.id === notif.id ? { ...n, read: true } : n)
                      );

                      // Then deep-link navigate
                      setCurrentSector(notif.sector);
                      setTimeout(() => {
                        const element = document.getElementById(`post-${notif.targetPostId}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          element.classList.add('ring-2', 'ring-blue-500', 'ring-offset-2');
                          setTimeout(() => element.classList.remove('ring-2', 'ring-blue-500', 'ring-offset-2'), 2000);
                        }
                      }, 300);
                    }}
                    className={`p-4 mx-2 my-1 rounded-xl transition-all duration-200 cursor-pointer text-left flex items-start gap-3 border ${
                      isUnread
                        ? 'bg-blue-50/80 border-blue-100 shadow-sm hover:bg-blue-100/50'
                        : 'bg-white border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {/* Visual unread badge dot */}
                    {isUnread && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0 animate-pulse" />
                    )}

                    <div className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-normal ${isUnread ? 'text-blue-950 font-bold' : 'text-slate-600 font-medium'}`}>
                        {notif.message}
                      </p>
                      <span className={`text-[10px] block mt-1 ${isUnread ? 'text-blue-400 font-medium' : 'text-slate-400'}`}>
                        {notif.time}
                      </span>
                    </div>
                  </div>
                );
              })}

              {notifications.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-500">No notifications yet</p>
                </div>
              )}
            </div>
          </>
        ) : (
          /* ─── SECTOR-SPECIFIC VIEW ─── */
          <>
            {/* User Greeting Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Welcome Back, {user?.username || "Resident"}
              </h3>
              <span className="text-xs text-slate-400 font-medium">
                {user?.location?.campSystem || "Kakuma"} — {currentSector}
              </span>
            </div>

            {/* Top Horizontal Progressive Progress Bar Track Wrapper */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2 mt-2 relative shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage || 45}%` }}
              />
            </div>

            {/* Accompanying Status Text Metadata labels */}
            <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-6">
              <span>Sector Setup Tracker</span>
              <span className="text-blue-600 font-extrabold">{progressPercentage || 45}% Verified</span>
            </div>

            {/* Micro-Location Focus Banner */}
            <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <p className="text-sm text-slate-700 font-medium">
                  Active Area Target:{" "}
                  <span className="font-semibold text-slate-900">
                    {user?.location?.specificLocation?.compound ||
                      "Main Compound"}{" "}
                    Cluster
                  </span>{" "}
                  — Structure No.{" "}
                  <span className="font-semibold text-slate-900">
                    {user?.location?.specificLocation?.houseNumber || "12"}
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setTimeout(() => {
                    const infoFeedContainer = document.getElementById('community-info-feed');
                    if (infoFeedContainer) {
                      infoFeedContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }, 100);
                }}
                className="bg-white text-blue-600 font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors shrink-0"
              >
                View Feed
              </button>
            </div>

            {/* Macro Location Grid Row — Locked to user profile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full text-left mt-4 mb-8">
              {/* Box 1 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <span className="text-slate-900 font-bold text-xl tracking-tight block">
                  {currentUser?.sectorArea || "Kakuma 1"}
                </span>
              </div>

              {/* Box 2 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <span className="text-slate-900 font-bold text-xl tracking-tight block">
                  {currentUser?.zoneDistrict || "Zone 3"}
                </span>
              </div>

              {/* Box 3 */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <span className="text-slate-900 font-bold text-xl tracking-tight block">
                  {currentUser?.blockCoordinate || "Block 1"}
                </span>
              </div>
            </div>

            {/* Hero Callout for sector-specific urgent alerts */}
            {primaryAlertInfo && (
              <div className="bg-blue-600 text-white rounded-2xl p-5 mb-8 shadow-sm text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
                <div className="relative z-10">
                  <span className="text-[10px] font-bold tracking-wider opacity-75 uppercase block mb-1">
                    {primaryAlertInfo.urgency === "High" ? "\uD83D\uDEA8 PRIORITY ALERT" : "\uD83D\uDCE2 LATEST UPDATE"}
                  </span>
                  <h3 className="font-bold text-lg leading-snug max-w-[85%] mb-3">
                    {(primaryAlertInfo.title || primaryAlertInfo.description || "").substring(0, 120)}
                    {(primaryAlertInfo.title || primaryAlertInfo.description || "").length > 120 ? "..." : ""}
                  </h3>
                  <button
                    onClick={() => {
                      setTimeout(() => {
                        const targetFeedNode = document.getElementById('community-info-feed');
                        if (targetFeedNode) targetFeedNode.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 100);
                    }}
                    className="bg-white text-blue-600 font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors cursor-pointer border-none"
                  >
                    View Feed
                  </button>
                </div>
              </div>
            )}

            {/* Feed Grid */}
            <div id="community-info-feed" className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Community Feed
              </h2>
              <p className="text-xs text-slate-400">
                {filteredAlerts.length} report
                {filteredAlerts.length !== 1 ? "s" : ""} in {currentSector}
                {searchQuery.trim() && (
                  <span className="text-slate-500">
                    {" "}
                    — matching &ldquo;{searchQuery.trim()}&rdquo;
                  </span>
                )}
              </p>
            </div>

            {filteredAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl p-12 text-center">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-slate-300 mb-3"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <p className="text-sm font-semibold text-slate-600">
                  No reports found in {currentSector}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try selecting a different sector or adjusting your search.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto mt-6">
                {filteredAlerts.map((alert) => {
                  const isPostBrandNew = !seenPostIds.includes(alert.id);
                  return (
                    <div key={alert.id} id={`post-${alert.id}`} className="relative">
                      {isPostBrandNew && (
                        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      )}
                      <PostCard alert={alert} />
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Center Column Footer */}
        <CenterColumnFooter />
      </main>

      {/* ─── Zoomed Urgent Alert Modal ─── */}
      {zoomedAlert && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          {/* Zoomed Card Container */}
          <div className="bg-white border border-slate-100 rounded-3xl p-8 max-w-xl w-full shadow-2xl relative animate-scale-up text-left">

            {/* Close Button Trigger */}
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-all text-xl border-none bg-transparent cursor-pointer"
              onClick={() => setZoomedAlert(null)}
            >
              ✕
            </button>

            {/* Emergency Category Badge Indicator */}
            <span className="bg-red-50 text-red-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              ⚠️ Priority Alert
            </span>

            {/* Zoomed Detailed Typography Elements */}
            <h3 className="text-xl font-extrabold text-slate-900 mt-4 mb-3 leading-snug">
              {zoomedAlert.title}
            </h3>

            <p className="text-slate-600 text-base leading-relaxed mb-6">
              {zoomedAlert.content || zoomedAlert.description}
            </p>

            {/* Meta Author / Timestamp Row Info */}
            <div className="flex items-center gap-3 border-t border-slate-100 pt-4 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                {typeof zoomedAlert.postedBy === 'object'
                  ? (zoomedAlert.postedBy.username?.[0]?.toUpperCase() || 'A')
                  : (zoomedAlert.postedBy?.[0]?.toUpperCase() || 'A')}
              </div>
              <div>
                <p className="font-semibold text-slate-700">
                  {typeof zoomedAlert.postedBy === 'object'
                    ? zoomedAlert.postedBy.username
                    : zoomedAlert.postedBy || 'Authorized Officer'}
                </p>
                <p>{zoomedAlert.createdAt ? new Date(zoomedAlert.createdAt).toLocaleDateString() : 'Just Now'} · {zoomedAlert.targetSector || 'Kakuma 1'}</p>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Darshboard;
