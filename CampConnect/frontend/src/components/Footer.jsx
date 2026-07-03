/**
 * CampConnect - Enterprise Footer
 * Professional SaaS footer with clean slate color system.
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Data Safety Guidelines */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Data Safety
            </h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li className="text-sm text-slate-600">
                All personal data is encrypted at rest and in transit.
              </li>
              <li className="text-sm text-slate-600">
                Location details are shared only within your sector feed.
              </li>
              <li className="text-sm text-slate-600">
                You can request full data deletion at any time.
              </li>
            </ul>
          </div>

          {/* Humanitarian Helplines */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Humanitarian Helplines
            </h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li className="text-sm text-slate-600">
                UNHCR Helpline&ensp;&mdash;&ensp;+254 800 723 253
              </li>
              <li className="text-sm text-slate-600">
                Kenya Red Cross&ensp;&mdash;&ensp;1199
              </li>
              <li className="text-sm text-slate-600">
                GBV Hotline&ensp;&mdash;&ensp;+254 719 638 006
              </li>
            </ul>
          </div>

          {/* Platform & Timestamp */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li className="text-sm text-slate-600">
                CampConnect v2.0 &mdash; Community Alert System
              </li>
              <li className="text-sm text-slate-600">
                Kakuma &amp; Kalobeyei Refugee Camps, Kenya
              </li>
              <li className="text-sm text-slate-400 text-xs">
                Rendered{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}{" "}
                at{" "}
                {new Date().toLocaleTimeString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rule */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-slate-400 text-center">
            &copy; {currentYear} CampConnect. Built for community resilience.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
