import { useState, useEffect } from "react";
import apiClient from "../../api/client";

function getLevelBadgeClass(level) {
  switch (level) {
    case "Beginner":
      return "bg-[#8A0030]/10 text-[#8A0030] px-3 py-1 rounded-full text-xs font-bold";
    case "Intermediate":
      return "bg-[#205E7A]/10 text-[#205E7A] px-3 py-1 rounded-full text-xs font-bold";
    case "All Levels":
    default:
      return "bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold";
  }
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses from the backend API on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get("/api/courses");
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section
      id="courses"
      className="w-full min-h-screen bg-[#f8fafc] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-start relative border-b border-slate-200"
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
          Our Courses
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto text-center mb-10">
          Practical, skills-based courses designed for refugee and host
          community learners at all levels.
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
        {courses.map((course) => (
          <div
            key={course._id}
            className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between text-left"
          >
            {/* Title */}
            <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-[#8A0030] transition-colors duration-200">
              {course.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              {course.description}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-auto">
              <span className={getLevelBadgeClass(course.level)}>
                {course.level}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {course.duration}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <a
        href="#apply"
        className="px-8 py-3 rounded-full text-white font-bold bg-[#8A0030] hover:bg-[#680024] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 block mx-auto mt-10 text-center text-sm"
      >
        Enroll Now
      </a>
    </section>
  );
}

export default Courses;
