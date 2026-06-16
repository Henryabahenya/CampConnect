import { useState, useEffect } from "react";
import apiClient from "../../api/client";
import { Globe, Code2, Cpu, Monitor, Megaphone, Palette } from "lucide-react";

// Icon mapping: Maps iconIdentifier strings from the database
// to their corresponding Lucide React icon components
const iconMap = {
  Globe: { component: Globe, color: "text-[#205E7A]", bg: "bg-[#205E7A]/10" },
  Code: { component: Code2, color: "text-[#8A0030]", bg: "bg-[#8A0030]/10" },
  Cpu: { component: Cpu, color: "text-[#205E7A]", bg: "bg-[#205E7A]/10" },
  Monitor: {
    component: Monitor,
    color: "text-[#8A0030]",
    bg: "bg-[#8A0030]/10",
  },
  Megaphone: {
    component: Megaphone,
    color: "text-[#205E7A]",
    bg: "bg-[#205E7A]/10",
  },
  Palette: {
    component: Palette,
    color: "text-[#8A0030]",
    bg: "bg-[#8A0030]/10",
  },
};

function WhatWeDo() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tracks from the backend API on component mount
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await apiClient.get("/api/tracks");
        setTracks(response.data);
      } catch (error) {
        console.error("Error fetching tracks:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  return (
    <section
      id="what-we-do"
      className="w-full min-h-screen bg-[#ffffff] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-start relative border-b border-slate-200"
    >
      {/* Inline Keyframes */}
      <style>{`
        @keyframes headColorShift {
          0%, 100% { color: #8A0030; }
          50% { color: #0f172a; }
          75% { color: #205E7A; }
        }
      `}</style>

      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-2 animate-[headColorShift_8s_infinite_ease-in-out]">
          What We Do
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto text-center mb-8">
          Professional skills tracks designed to transform learners into
          industry-ready technologists and creators.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-4 border-[#8A0030]/20 border-t-[#8A0030] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {tracks.map((track) => {
          const iconData = iconMap[track.iconIdentifier] || iconMap["Globe"];
          const IconComponent = iconData.component;
          return (
            <div
              key={track._id}
              className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col items-start text-left"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl ${iconData.bg} flex items-center justify-center mb-5`}
              >
                <IconComponent className={`w-6 h-6 ${iconData.color}`} />
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#8A0030] transition-colors duration-200">
                {track.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-500 leading-relaxed">
                {track.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WhatWeDo;
