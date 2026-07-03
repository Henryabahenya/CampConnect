/**
 * CampConnect — About Page
 */
export default function AboutPage() {
  return (
    <div className="py-20 px-8 max-w-5xl mx-auto text-left animate-fade-in">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        About CampConnect
      </h1>
      <p className="text-slate-500 text-sm max-w-2xl mb-12 leading-relaxed">
        A localized digital ecosystem built to handle communications, resource
        management, and neighborhood connectivity infrastructure dynamically.
      </p>

      <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-6">
        Services and Functionality
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl">
          <h3 className="font-bold text-slate-800 text-sm mb-2">
            Targeted Announcements
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Delivers crucial priority notices, safety reports, and structural
            warnings targeted exclusively down to your mapped coordinates.
          </p>
        </div>
        <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl">
          <h3 className="font-bold text-slate-800 text-sm mb-2">
            Incident Management
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Empowers community residents to file structural repair needs,
            service system requests, and grid utility updates directly.
          </p>
        </div>
        <div className="border border-slate-100 bg-slate-50/50 p-6 rounded-2xl">
          <h3 className="font-bold text-slate-800 text-sm mb-2">
            Block Level Forums
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ensures hyper-local discussions stay contained within isolated group
            contexts, filtering out extraneous data fatigue.
          </p>
        </div>
      </div>
    </div>
  );
}
