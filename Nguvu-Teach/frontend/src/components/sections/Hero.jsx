import { useEffect, useRef } from "react";
import heroCodingImage from "../../assets/image/image.png";

function Hero() {
  const sectionRef = useRef(null);

  // Mount-driven staggered entrance for text elements
  useEffect(() => {
    const elements = sectionRef.current?.querySelectorAll("[data-animate]");
    elements?.forEach((el, i) => {
      setTimeout(() => {
        el.classList.remove("opacity-0", "translate-y-6");
        el.classList.add("opacity-100", "translate-y-0");
      }, 150 * i);
    });
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-[90vh] bg-[#fafbfc] overflow-hidden"
    >
      {/* Subtle Tech Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #8080800a 1px, transparent 1px), linear-gradient(to bottom, #8080800a 1px, transparent 1px)",
          backgroundSize: "14px 24px",
        }}
      />

      {/* Ambient Glow — Left (behind text) */}
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-gradient-radial from-primary-200/20 to-transparent blur-3xl animate-pulse [animation-duration:8s]" />

      {/* Ambient Glow — Right (behind image) */}
      <div className="absolute bottom-1/4 -right-24 w-[400px] h-[400px] rounded-full bg-gradient-radial from-secondary-200/15 to-transparent blur-3xl animate-pulse [animation-duration:10s]" />

      {/* Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[90vh] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-20 lg:py-0">
        {/* Left Column — Text Module */}
        <div className="flex flex-col justify-center space-y-6">
          {/* Accent Tagline — Monospace Engineering Label */}
          <p
            data-animate
            className="text-xs font-bold text-primary-500 tracking-[0.2em] uppercase font-mono opacity-0 translate-y-6 transition-all duration-700 ease-out"
          >
            Empowering Future Developers
          </p>

          {/* Main Headline — persistent subtle pulse */}
          <h1
            data-animate
            className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-[#0f172a] tracking-tight leading-[1.15] animate-proverb-pulse opacity-0 translate-y-6 transition-all duration-700 ease-out"
          >
            Empower Your Future with Advanced Technical Skills
          </h1>

          {/* Curious Question — persistent subtle pulse */}
          <p
            data-animate
            className="text-lg sm:text-xl font-semibold text-neutral-600 animate-proverb-pulse opacity-0 translate-y-6 transition-all duration-700 ease-out"
          >
            What new skill do you want to acquire today?
          </p>

          {/* Body Paragraph */}
          <p
            data-animate
            className="text-base text-neutral-500 leading-relaxed max-w-md opacity-0 translate-y-6 transition-all duration-700 ease-out"
          >
            Nguvu-Teach is a premier tech hub driven by advanced learning
            frameworks, making it seamless for you to master digital systems,
            software engineering tracks, and global market demands.
          </p>

          {/* CTA Buttons — Side by Side */}
          <div
            data-animate
            className="flex flex-row items-center gap-4 mt-6 opacity-0 translate-y-6 transition-all duration-700 ease-out"
          >
            <a
              href="#apply"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-white bg-primary-500 rounded-full shadow-md hover:bg-primary-600 hover:shadow-lg transition-all duration-300"
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
              className="inline-flex items-center gap-1.5 px-6 py-4 text-sm font-semibold text-primary-500 border border-primary-200 rounded-full hover:bg-primary-50 transition-all duration-200"
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

        {/* Right Column — Static Image Panel */}
        <div
          data-animate
          className="flex items-center justify-center opacity-0 translate-y-6 transition-all duration-700 ease-out"
        >
          <div className="relative">
            <img
              src={heroCodingImage}
              alt="Nguvu-Teach Professional Coding Environment"
              className="w-full h-auto object-contain mx-auto max-w-[550px] lg:max-w-full rounded-2xl border border-gray-200/50 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
