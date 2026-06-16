import { useState } from "react";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";

function About() {
  const [expanded, setExpanded] = useState(false);
  const [showMoreLocation, setShowMoreLocation] = useState(false);

  return (
    <section
      id="about"
      className="w-full min-h-screen bg-[#f8fafc] pt-28 pb-12 px-6 md:px-12 flex flex-col justify-start gap-y-8 md:gap-y-10 relative border-b border-slate-200"
    >
      {/* Inline Keyframes for Header Color Shift */}
      <style>{`
        @keyframes headColorShift {
          0%, 100% { color: #8A0030; }
          50% { color: #0f172a; }
          75% { color: #205E7A; }
        }
        @keyframes revealAndColorShiftVeryFast {
          0% { opacity: 0; color: #0f172a; transform: translateY(4px); }
          12% { opacity: 1; transform: translateY(0); }
          20%, 100% { opacity: 1; }
          35% { color: #8A0030; }
          60% { color: #0f172a; }
          85% { color: #205E7A; }
        }
      `}</style>

      {/* ─── Top: Philosophy + Title ─── */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        {/* Philosophy Banner */}
        <blockquote className="mb-4">
          <p className="bg-gradient-to-r from-[#8A0030] via-slate-900 to-[#8A0030] bg-clip-text text-transparent bg-[size:200%_auto] animate-[pulse_4s_infinite_ease-in-out] font-extrabold text-lg md:text-xl tracking-tight max-w-4xl mx-auto">
            &ldquo;Technology is the lever that moves the world, and AI is the
            light that guides it.&rdquo;
          </p>
          <footer className="mt-2 text-xs font-semibold text-slate-400 tracking-[0.2em] uppercase">
            — NGUVU-TEACH PHILOSOPHY
          </footer>
        </blockquote>

        {/* Section Title — Animated Color Shift */}
        <h2
          className="text-2xl md:text-3xl font-black tracking-tight mt-4 mb-2"
          style={{ animation: "headColorShift 8s ease-in-out infinite" }}
        >
          About Nguvu-Teach
        </h2>
        <p className="text-slate-500 text-sm max-w-2xl mx-auto">
          &ldquo;Nguvu&rdquo; means{" "}
          <span className="text-[#8A0030] font-bold">strength</span> in Swahili
          — reflecting our commitment to empowering individuals through
          knowledge and digital skills.
        </p>
      </div>

      {/* ─── Middle: Core Summary + Location ─── */}
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start mt-4">
          {/* Col 1: Intro Summary */}
          <div className="lg:col-span-2">
            <p className="text-slate-600 text-sm leading-relaxed mb-4">
              Nguvu-TEACH is a nonprofit organization empowering refugees and
              marginalized communities through digital skills training and
              entrepreneurship education. We combine in-person instruction with
              cutting-edge digital tools to equip learners with practical skills
              in software engineering, AI, digital marketing, and technical
              maintenance.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs font-medium text-slate-600">
              <div>
                <span className="text-slate-700 font-semibold">Motto: </span>
                <span className="text-[#8A0030] font-extrabold font-serif">
                  &ldquo;Tech For All Everywhere&rdquo;
                </span>
              </div>
              <div>
                <span className="text-slate-700 font-semibold">
                  Structure:{" "}
                </span>
                Non-profit Organization
              </div>
              <div>
                <span className="text-slate-700 font-semibold">Founded: </span>
                2024
              </div>
              <div>
                <span className="text-slate-700 font-semibold">Location: </span>
                Kalobeyei Village 3, Kenya
              </div>
            </div>
          </div>

          {/* Col 2: Location Card */}
          <div className="bg-white/60 border border-slate-200/60 p-5 md:p-6 rounded-2xl shadow-xs">
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[#205E7A] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-black tracking-wider text-[#205E7A] uppercase mb-0.5">
                  OUR LOCATION
                </h4>
                <p className="text-slate-700 text-xs font-semibold">
                  Kalobeyei Settlement, Village three center
                </p>
              </div>
            </div>

            {/* Show More Location Toggle */}
            <div className="mt-1">
              <button
                onClick={() => setShowMoreLocation(!showMoreLocation)}
                className="text-[11px] font-bold text-[#8A0030] hover:underline block mb-1"
              >
                {showMoreLocation
                  ? "Show Less Details \u2191"
                  : "Show More Details \u2193"}
              </button>

              {showMoreLocation && (
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 mt-1 max-h-[80px] overflow-y-auto">
                  <ul className="list-disc pl-4 space-y-1">
                    <li>
                      Primary landmark: Near WFP Tumaini Market &amp; UNHCR
                      distribution center.
                    </li>
                    <li>
                      Accessibility: Accessible via main settlement service
                      routes; visitor check-in at Village 3 center gate.
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── Learn More Toggle ─── */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-[#205E7A] hover:text-[#8A0030] transition-colors duration-200 mx-auto"
        >
          {expanded ? "Show Less" : "Learn More — Vision, Mission & Values"}
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {/* ─── Expandable Company Overview ─── */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            expanded
              ? "max-h-[500px] opacity-100 mt-6 overflow-y-auto"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/60 border border-slate-200/60 rounded-2xl shadow-sm">
            {/* Vision Card */}
            <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-black tracking-widest text-[#205E7A] block mb-1">
                1:1 VISION
              </span>
              <p className="text-slate-600 text-xs leading-relaxed">
                A world where every Refugee and Marginalized individual has
                access to quality education, digital literacy, and the skills
                needed to thrive in the digital economy.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-xs">
              <span className="text-xs font-black tracking-widest text-[#205E7A] block mb-1">
                1:2 MISSION
              </span>
              <p className="text-slate-600 text-xs leading-relaxed">
                To empower refugee and marginalized youth through accessible
                digital skills training, fostering self-reliance, innovation,
                and sustainable livelihoods in underserved communities.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="mt-4">
            <h4
              className="text-sm font-bold tracking-tight mb-2"
              style={{ animation: "headColorShift 6s ease-in-out infinite" }}
            >
              Core Values
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                "Inclusivity",
                "Innovation",
                "Empowerment",
                "Sustainability",
                "Collaboration",
              ].map((value) => (
                <span
                  key={value}
                  className="inline-block text-xs font-bold text-[#8A0030] bg-[#8A0030]/5 px-2.5 py-1 rounded-full"
                >
                  {value}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <span className="text-[#8A0030] font-black">Empowerment:</span>{" "}
                Equipping individuals with knowledge and skills for a brighter
                future.
              </p>
              <p>
                <span className="text-[#8A0030] font-black">Inclusivity:</span>{" "}
                Programs accessible to all, regardless of gender, age, or
                background.
              </p>
              <p>
                <span className="text-[#8A0030] font-black">Innovation:</span>{" "}
                Leveraging technology and modern methodologies for enhanced
                learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom: Tech Validation Ticker ─── */}
      <div className="w-full border-t border-slate-200/60 pt-6 pb-6 px-4 bg-white/40 backdrop-blur-md mt-auto">
        <p className="text-center text-xs font-bold tracking-[0.2em] text-slate-500 uppercase mb-2">
          Trusted by Learners Building With
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 font-bold text-sm md:text-base">
          {[
            "React",
            "Node.js",
            "Python",
            "AWS",
            "Docker",
            "TypeScript",
            "Figma",
            "Git",
          ].map((tech, index) => (
            <span
              key={tech}
              style={{
                animationDelay: `${index * 0.4}s`,
                animationFillMode: "both",
              }}
              className="animate-[revealAndColorShiftVeryFast_3s_infinite_ease-in-out] inline-block transition-all duration-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;
