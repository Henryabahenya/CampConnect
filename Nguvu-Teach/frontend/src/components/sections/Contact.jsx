import { useState } from "react";
import apiClient from "../../api/client";

function Contact() {
  // Controlled input state hooks for contact form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Success confirmation banner state
  const [successMessage, setSuccessMessage] = useState("");
  // Loading state to prevent double-submits
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Async form submission handler — sends to /api/messages
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      };

      await apiClient.post("/api/messages", payload);

      // Reset all inputs on success
      setFormData({ name: "", email: "", subject: "", message: "" });

      // Show temporary visual confirmation overlay
      setSuccessMessage(
        "Message sent successfully! We'll get back to you soon.",
      );
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Error sending message:", error.message);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        id="contact"
        className="w-full min-h-screen bg-[#f8fafc] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-start relative"
      >
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-2 animate-[headColorShift_8s_infinite_ease-in-out]">
            Contact Us
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto text-center mb-10">
            Have questions or want to partner with us? We&apos;d love to hear
            from you.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto px-4 w-full">
          {/* Left: Contact Info */}
          <div className="space-y-6">
            {/* Location */}
            <div className="flex items-start gap-4 bg-white/70 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#205E7A]/10 text-[#205E7A] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Location</h4>
                <p className="text-slate-600 text-sm mt-0.5">
                  Kalobeyei Settlement, Village three center
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4 bg-white/70 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#8A0030]/10 text-[#8A0030] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Email</h4>
                <a
                  href="mailto:nguvuteach@gmail.com"
                  className="text-slate-700 hover:text-[#8A0030] text-sm mt-0.5 inline-block transition-colors duration-200"
                >
                  nguvuteach@gmail.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 bg-white/70 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#205E7A]/10 text-[#205E7A] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Phone</h4>
                <a
                  href="tel:+254704659108"
                  className="text-slate-700 hover:text-[#8A0030] text-sm mt-0.5 inline-block transition-colors duration-200"
                >
                  +254704659108
                </a>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-4 bg-white/70 backdrop-blur-sm border border-slate-200/60 p-5 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="w-11 h-11 rounded-xl bg-[#8A0030]/10 text-[#8A0030] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  Office Hours
                </h4>
                <p className="text-slate-600 text-sm mt-0.5">
                  Mon – Fri: 8:00 AM – 5:00 PM EAT
                </p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-sm border border-slate-200/60 p-6 md:p-8 rounded-2xl shadow-sm space-y-5"
          >
            {/* Success Banner */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-5 py-3 rounded-xl text-sm font-bold text-center shadow-sm">
                ✅ {successMessage}
              </div>
            )}

            <div>
              <label
                htmlFor="contact-name"
                className="block text-xs font-black tracking-wide uppercase text-slate-600 mb-1"
              >
                Your Name *
              </label>
              <input
                type="text"
                id="contact-name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200"
                placeholder="Full name"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-xs font-black tracking-wide uppercase text-slate-600 mb-1"
              >
                Email *
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="contact-subject"
                className="block text-xs font-black tracking-wide uppercase text-slate-600 mb-1"
              >
                Subject *
              </label>
              <input
                type="text"
                id="contact-subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-xs font-black tracking-wide uppercase text-slate-600 mb-1"
              >
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200 resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-white font-bold bg-[#8A0030] hover:bg-[#680024] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 block mt-4 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default Contact;
