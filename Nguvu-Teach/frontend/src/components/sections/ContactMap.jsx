import { MapPin, Clock, ExternalLink } from "lucide-react";

function ContactMap() {
  return (
    <>
      <style>{`
        @keyframes headColorShift {
          0%, 100% { color: #8A0030; }
          33% { color: #0f172a; }
          66% { color: #205E7A; }
        }
      `}</style>

      <section
        id="find-us"
        className="w-full min-h-screen bg-[#ffffff] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-start relative border-b border-slate-200"
      >
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-2 animate-[headColorShift_8s_infinite_ease-in-out]">
            Find Us
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto text-center mb-10">
            Visit our innovation hub in the heart of Kalobeyei Settlement.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4 w-full items-stretch">
          {/* Left Column — Location Info Card */}
          <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <h3 className="text-xl font-black text-slate-800 mb-6">
                Visit Our Innovation Hub
              </h3>

              {/* Address */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-11 h-11 rounded-xl bg-[#205E7A]/10 text-[#205E7A] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide uppercase text-slate-600 mb-1">
                    Address
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Kalobeyei Settlement, Village three center
                  </p>
                </div>
              </div>

              {/* Operational Hours */}
              <div className="flex items-start gap-4 mb-8">
                <div className="w-11 h-11 rounded-xl bg-[#8A0030]/10 text-[#8A0030] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide uppercase text-slate-600 mb-1">
                    Operational Hours
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Monday – Friday: 8:00 AM – 5:00 PM
                    <br />
                    Saturday: 9:00 AM – 1:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Get Directions Button */}
            <a
              href="https://www.google.com/maps/search/Kalobeyei+Refugee+Settlement+Village+3"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl text-white font-bold bg-[#8A0030] hover:bg-[#680024] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 mt-6 cursor-pointer text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Get Directions
            </a>
          </div>

          {/* Right Column — Embedded Google Map */}
          <div className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
            <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden border border-slate-100 shadow-inner relative">
              <iframe
                title="Nguvu-Teach Location - Kalobeyei Settlement"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15941.36531393848!2d34.8219444!3d3.4333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17742167fa60bb37%3A0x679c6569e5d71321!2sKalobeyei%20Refugee%20Settlement!5e0!3m2!1sen!2ske!4v1717840000000!5m2!1sen!2ske"
                width="100%"
                height="100%"
                style={{ border: 0, position: "absolute", inset: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactMap;
