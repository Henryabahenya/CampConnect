import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

/**
 * CampConnect — Home Page
 * Premium white and blue hero layout with orbit interaction.
 */
const LandingPage = () => {
  const [brandingPillars, setBrandingPillars] = useState([
    "Connect",
    "Engage",
    "Support",
    "Protect",
  ]);

  const [residentsConnected, setResidentsConnected] = useState("15k+");

  useEffect(() => {
    const fetchLandingConfig = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL || "";
        const response = await fetch(`${base}/api/layout/landing-config`);
        if (!response.ok) {
          throw new Error("Failed to load landing page configuration");
        }
        const data = await response.json();
        if (data?.brandingPillars?.length) {
          setBrandingPillars(data.brandingPillars);
        }
        if (data?.residentsConnected) {
          setResidentsConnected(data.residentsConnected);
        }
      } catch (error) {
        console.error("Landing config fetch error:", error);
      }
    };

    fetchLandingConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-blue-50/50 p-6 font-sans text-slate-900">
      <main className="relative mx-auto max-w-7xl mt-8 px-4 pb-16">
        <section className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <div className="space-y-8 rounded-[2rem] bg-white/90 border border-slate-100 shadow-[0_40px_120px_-70px_rgba(15,23,42,0.15)] p-10 sm:p-12">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 lg:text-5xl">
                Connecting Refugee Communities, One Block at a Time.
              </h1>
              <p className="mt-6 text-slate-500 text-sm leading-7 max-w-xl">
                Get real-time sector notifications, report local infrastructure
                breakdowns instantly, and stay connected with your neighborhood
                coordinates.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-100 transition hover:bg-blue-700"
              >
                Enter Dashboard &gt;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-500 text-sm leading-6">
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-4">
                <p className="font-semibold text-slate-900">
                  Block-level alert routing
                </p>
                <p className="mt-2">
                  Receive only the notifications that matter to your exact
                  sector and block.
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 border border-slate-100 p-4">
                <p className="font-semibold text-slate-900">
                  Secure local coordination
                </p>
                <p className="mt-2">
                  Keep neighborhood communication private and anchored to your
                  community grid.
                </p>
              </div>
            </div>
          </div>

          <div className="relative isolate mx-auto w-full max-w-xl rounded-[2rem] bg-white/90 px-8 py-10 shadow-[0_40px_90px_-40px_rgba(15,23,42,0.14)] border border-slate-100">
            <div className="absolute inset-0 rounded-[2rem] ring-1 ring-slate-100/80" />
            <div className="relative flex items-center justify-center">
              <div className="relative flex h-[360px] w-[360px] items-center justify-center">
                <div className="absolute inset-0 m-auto h-40 w-40 rounded-full border border-slate-200/80 bg-white/70 shadow-sm" />
                <div className="absolute inset-0 m-auto h-60 w-60 rounded-full border border-slate-200/80" />
                <div className="absolute inset-0 m-auto h-80 w-80 rounded-full border border-slate-200/80" />

                <div className="relative z-10 flex flex-col items-center justify-center rounded-full bg-white px-8 py-8 text-center shadow-[0_18px_50px_-30px_rgba(15,23,42,0.25)]">
                  <p className="text-3xl font-extrabold text-slate-900">
                    {residentsConnected}
                  </p>
                  <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Residents
                  </p>
                </div>

                <div className="absolute left-1/2 top-6 -translate-x-1/2 rounded-full border border-slate-200/80 bg-white p-2 shadow-sm">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-sm font-semibold text-slate-900">
                    AL
                  </div>
                </div>

                <div className="absolute right-10 top-28 flex h-12 min-w-[70px] items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                  Sector Feed
                </div>

                <div className="absolute left-10 top-40 flex h-12 min-w-[70px] items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                  Safe Aid
                </div>

                <div className="absolute right-1/4 bottom-10 flex h-12 min-w-[70px] items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                  Water
                </div>

                <div className="absolute left-1/4 bottom-12 flex h-12 min-w-[70px] items-center justify-center rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600">
                  Health
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="w-full max-w-7xl mx-auto pt-12 mt-16 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-8 px-4 opacity-40 hover:opacity-60 transition-opacity">
          {brandingPillars.map((pillar, index) => (
            <span
              key={pillar}
              style={{ animationDelay: `${index * 0.4}s` }}
              className="text-xs font-bold uppercase tracking-widest text-slate-600 animate-pillar-color"
            >
              {pillar}
            </span>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
