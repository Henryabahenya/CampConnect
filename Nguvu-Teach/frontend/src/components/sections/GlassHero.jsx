import { useEffect } from "react";

const brandLogos = [
  "React",
  "Node.js",
  "Python",
  "AWS",
  "Docker",
  "TypeScript",
  "Figma",
  "Git",
];

function GlassHero() {
  // Force scroll to top on mount/reload
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <section
      id="hero"
      className="w-full min-h-screen pt-32 md:pt-36 pb-0 px-6 overflow-hidden bg-[#f8fafc] flex flex-col justify-between items-center relative"
    >
      {/* ─── Ultra-Soft Breathing Background Blobs ─── */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-8%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#205E7A]/20 via-[#205E7A]/10 to-[#8A0030]/15 blur-[140px] opacity-35 animate-blob-drift" />
        <div className="absolute bottom-[-10%] right-[-6%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-[#8A0030]/15 via-[#205E7A]/10 to-[#205E7A]/20 blur-[140px] opacity-35 animate-blob-drift-reverse" />
        <div
          className="absolute top-[30%] left-[40%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#205E7A]/15 via-[#8A0030]/10 to-[#205E7A]/10 blur-[140px] opacity-35 animate-blob-drift"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      {/* ─── Full-Screen Glassmorphism Canvas ─── */}
      <div className="w-full h-full bg-white/80 backdrop-blur-2xl border-none shadow-none flex flex-col justify-between">
        {/* ─── Perfectly Centered Viewport Content ─── */}
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 py-12 md:py-16">
          {/* Accent Tagline */}
          <p className="text-xs font-semibold tracking-[0.2em] text-[#205E7A] uppercase mb-4">
            EMPOWERING FUTURE DEVELOPERS
          </p>

          {/* Main Headline — Sequential Word Reveal (Fail-Safe Inline Keyframes) */}
          <div className="w-full text-center max-w-3xl mx-auto mb-5">
            <style>{`
              @keyframes wordFadeIn {
                from {
                  opacity: 0;
                  transform: translateY(6px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              @keyframes pureColorShift {
                0%, 100% { color: #0f172a; filter: saturate(100%); }
                33% { color: #8A0030; filter: saturate(110%); }
                66% { color: #205E7A; filter: saturate(110%); }
              }
            `}</style>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] flex flex-wrap justify-center gap-x-3 gap-y-2">
              {"Empower Your Future with Advanced Technical Skills"
                .split(" ")
                .map((word, index) => (
                  <span
                    key={index}
                    className="inline-block"
                    style={{
                      opacity: 0,
                      animationName: "wordFadeIn, pureColorShift",
                      animationDuration: "0.6s, 8s",
                      animationDelay: `${index * 200}ms, ${index * 200 + 600}ms`,
                      animationTimingFunction: "ease-out, ease-in-out",
                      animationIterationCount: "1, infinite",
                      animationFillMode: "forwards, none",
                    }}
                  >
                    {word}
                  </span>
                ))}
            </h1>
          </div>

          {/* Curious Question — Gradient Shimmer */}
          <p className="text-lg md:text-xl font-medium mt-4 max-w-2xl mx-auto text-[#205E7A] text-center mb-4">
            What new skill do you want to acquire today?
          </p>

          {/* Body Description */}
          <p className="text-base text-gray-500 max-w-2xl mx-auto mt-6 leading-relaxed">
            Nguvu-Teach is a premier tech hub driven by advanced learning
            frameworks, making it seamless for you to master digital systems,
            software engineering tracks, and global market demands.
          </p>

          {/* Symmetric CTA Buttons */}
          <div className="flex flex-row items-center justify-center gap-4 mt-8">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 bg-[#8A0030] text-white px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-[#6b0024] hover:shadow-lg"
            >
              Get started
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="#courses"
              className="inline-flex items-center gap-1.5 px-6 py-3 text-sm font-semibold text-[#205E7A] hover:text-[#184a61] transition-colors duration-200"
            >
              Explore
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* ─── Bottom Trust Row (Anchored to Viewport Bottom) ─── */}
        <div className="w-full border-t border-slate-200/80 pt-8 pb-8 px-6 md:px-10 mt-auto bg-white/40 backdrop-blur-sm">
          <span className="text-[13px] md:text-[14px] font-black tracking-[0.25em] mb-8 block text-center w-full bg-gradient-to-r from-[#8A0030] via-[#205E7A] to-[#8A0030] bg-clip-text text-transparent animate-text-shimmer bg-[length:200%_auto]">
            TRUSTED BY LEARNERS BUILDING WITH
          </span>
          <div className="flex flex-row flex-wrap justify-center items-center gap-8 md:gap-12 max-w-6xl mx-auto">
            {brandLogos.map((brand, index) => (
              <span
                key={brand}
                className="text-base font-extrabold tracking-wide bg-gradient-to-r from-[#8A0030] via-[#205E7A] to-[#8A0030] bg-clip-text text-transparent animate-brand-reveal bg-[length:200%_auto] opacity-0 cursor-default select-none"
                style={{
                  animationDelay: `${index}s`,
                  animationFillMode: "both",
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default GlassHero;
