import { useState, useEffect } from "react";
import apiClient from "../../api/client";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events from the backend API on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient.get("/api/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section
      id="events"
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
          Upcoming Events
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto text-center mb-10">
          Join us for community events, workshops, and celebrations of learning.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-4 border-[#205E7A]/20 border-t-[#205E7A] rounded-full animate-spin"></div>
        </div>
      )}

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 w-full">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between text-left"
          >
            {/* Title */}
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#8A0030] transition-colors duration-200 mb-2">
              {event.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              {event.description}
            </p>

            {/* Date Badge */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-[#205E7A]">
              <span className="text-[#8A0030]">📅</span>
              <span>
                {new Date(event.eventDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Events;
