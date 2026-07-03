import { useMockAuth } from "../context/MockAuthContext";
import { mockAlerts } from "../utils/mockData";

/**
 * RightPanel — Persistent Right Analytics & User Metrics Sidebar
 */
const RightPanel = ({ alerts: externalAlerts }) => {
  const { user } = useMockAuth();
  const alerts = externalAlerts || mockAlerts;

  return (
    <aside className="w-80 bg-white border-l border-slate-100 p-6 hidden xl:block overflow-y-auto">
      {/* User Welcome Block */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.username}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-600">
              {user?.username?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {user?.username || "Resident"}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {user?.role || "Community Member"}
            </p>
          </div>
        </div>
      </div>

      {/* Active Profile Stats */}
      <div className="mb-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Profile Stats
        </p>
        <div className="space-y-3">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Household Coordinates
            </p>
            <p className="text-sm font-bold text-slate-800">
              {user?.location?.specificLocation?.zone || "Zone 3"},{" "}
              {user?.location?.specificLocation?.block || "Block 1"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Registered Camp
            </p>
            <p className="text-sm font-bold text-slate-800">
              {user?.location?.campSystem || "Kakuma"} —{" "}
              {user?.location?.sector || "Kakuma 1"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Structure No.
            </p>
            <p className="text-sm font-bold text-slate-800">
              {user?.location?.specificLocation?.houseNumber || "12"}
            </p>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
              Reports Filed
            </p>
            <p className="text-sm font-bold text-slate-800">{alerts.length}</p>
          </div>
        </div>
      </div>

      {/* Emergency Hotlines */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Emergency Hotlines
        </p>
        <div className="space-y-2">
          {[
            { label: "UNHCR Helpline", number: "+254 800 723 253" },
            { label: "Camp Security", number: "+254 700 000 111" },
            { label: "Medical Emergency", number: "+254 700 000 222" },
            { label: "Water & Sanitation", number: "+254 700 000 333" },
          ].map((hotline) => (
            <div
              key={hotline.label}
              className="flex items-center justify-between bg-red-50/60 border border-red-100/60 rounded-xl px-3 py-2.5"
            >
              <div>
                <p className="text-[11px] font-semibold text-slate-700">
                  {hotline.label}
                </p>
                <p className="text-[11px] text-red-600 font-mono font-bold">
                  {hotline.number}
                </p>
              </div>
              <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-red-500"
                >
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default RightPanel;
