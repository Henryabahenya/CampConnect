import { useState } from "react";
import apiClient from "../../api/client";

function Apply() {
  // Controlled input state hooks for all form fields
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    courseOfInterest: "",
    whyJoin: "",
  });

  // Success banner state
  const [successMessage, setSuccessMessage] = useState("");
  // Loading state to prevent double-submits
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Async form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields exist before sending
    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.courseOfInterest
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        courseOfInterest: formData.courseOfInterest,
        whyJoin: formData.whyJoin,
      };

      await apiClient.post("/api/applications", payload);

      // Reset form fields on success
      setFormData({
        fullName: "",
        phoneNumber: "",
        emailAddress: "",
        courseOfInterest: "",
        whyJoin: "",
      });

      // Show temporary success banner message
      setSuccessMessage("Application submitted successfully!");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      console.error("Error submitting application:", error.message);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full mt-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#205E7A] focus:ring-1 focus:ring-[#205E7A] transition-all duration-200";

  return (
    <section
      id="apply"
      className="w-full min-h-screen bg-[#ffffff] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-start relative border-b border-slate-200"
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
          Apply Now
        </h2>
        <p className="text-sm text-slate-500 max-w-xl mx-auto text-center mb-8">
          Ready to start your learning journey? Fill out the form below and
          we&apos;ll be in touch.
        </p>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="max-w-3xl mx-auto w-full mb-6 px-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl text-sm font-bold text-center shadow-sm animate-[fadeIn_0.3s_ease-in-out]">
            ✅ {successMessage}
          </div>
        </div>
      )}

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto w-full bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col gap-y-4"
      >
        {/* Name & Phone Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="fullName"
              className="text-xs font-black tracking-wide text-slate-700 uppercase"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Your full name"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="text-xs font-black tracking-wide text-slate-700 uppercase"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputClass}
              placeholder="+254 7XX XXX XXX"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="emailAddress"
            className="text-xs font-black tracking-wide text-slate-700 uppercase"
          >
            Email Address
          </label>
          <input
            type="email"
            id="emailAddress"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            className={inputClass}
            placeholder="you@example.com (optional)"
          />
        </div>

        {/* Course Select */}
        <div>
          <label
            htmlFor="courseOfInterest"
            className="text-xs font-black tracking-wide text-slate-700 uppercase"
          >
            Course of Interest *
          </label>
          <select
            id="courseOfInterest"
            name="courseOfInterest"
            required
            value={formData.courseOfInterest}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select a course</option>
            <option value="Introduction to Web Development">
              Introduction to Web Development
            </option>
            <option value="Digital Marketing Essentials">
              Digital Marketing Essentials
            </option>
            <option value="Computer Literacy & Office Tools">
              Computer Literacy & Office Tools
            </option>
            <option value="Graphic Design with Canva">
              Graphic Design with Canva
            </option>
            <option value="English Language Proficiency">
              English Language Proficiency
            </option>
            <option value="Entrepreneurship & Business Skills">
              Entrepreneurship & Business Skills
            </option>
          </select>
        </div>

        {/* Why Join */}
        <div>
          <label
            htmlFor="whyJoin"
            className="text-xs font-black tracking-wide text-slate-700 uppercase"
          >
            Why do you want to join? (Optional)
          </label>
          <textarea
            id="whyJoin"
            name="whyJoin"
            rows={4}
            value={formData.whyJoin}
            onChange={handleChange}
            className={`${inputClass} resize-none`}
            placeholder="Tell us about your goals..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-10 py-3 rounded-xl text-white font-bold bg-[#8A0030] hover:bg-[#680024] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 block mx-auto mt-6 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </section>
  );
}

export default Apply;
