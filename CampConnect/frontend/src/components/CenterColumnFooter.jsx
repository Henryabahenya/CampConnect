const CenterColumnFooter = () => {
  return (
    <footer className="w-full bg-slate-100 border-t-2 border-slate-200 py-10 px-8 mt-16 clear-both text-left shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Left Side Header Brand Details */}
        <div className="max-w-xs">
          <h4 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            CampConnect Emergency Hotlines
          </h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Please use these vertical hotlines exclusively for active crisis
            deployment, medical dispatch, or sanitation emergencies.
          </p>
        </div>

        {/* Right Side Vertical Stack Grid Directory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto min-w-[340px]">
          {/* UNHCR HELPLINE */}
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl flex flex-col gap-1 shadow-sm hover:border-red-200 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              UNHCR Helpline
            </span>
            <a
              href="tel:+254768407749"
              className="text-red-600 font-extrabold text-sm hover:underline tracking-tight"
            >
              +254 768 407 749
            </a>
          </div>

          {/* CAMP SECURITY */}
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl flex flex-col gap-1 shadow-sm hover:border-red-200 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Camp Security
            </span>
            <a
              href="tel:+254700000111"
              className="text-red-600 font-extrabold text-sm hover:underline tracking-tight"
            >
              +254 700 000 111
            </a>
          </div>

          {/* MEDICAL EMERGENCY */}
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl flex flex-col gap-1 shadow-sm hover:border-red-200 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Medical Emergency
            </span>
            <a
              href="tel:+254700000222"
              className="text-red-600 font-extrabold text-sm hover:underline tracking-tight"
            >
              +254 700 000 222
            </a>
          </div>

          {/* WATER & SANITATION */}
          <div className="bg-white border border-slate-200/80 p-3.5 rounded-xl flex flex-col gap-1 shadow-sm hover:border-red-200 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Water & Sanitation
            </span>
            <a
              href="tel:+254700000333"
              className="text-red-600 font-extrabold text-sm hover:underline tracking-tight"
            >
              +254 700 000 333
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6 pt-4 border-t border-slate-200 text-slate-400 text-xs flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; 2026 CampConnect. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <span>Terms of Service</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};

export default CenterColumnFooter;
