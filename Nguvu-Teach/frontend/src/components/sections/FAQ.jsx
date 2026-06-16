import { useState } from "react";

const faqs = [
  {
    question: "Who can join Nguvu-Teach programs?",
    answer:
      "Our programs are open to all learners aged 15 and above in Kalobeyei Settlement and surrounding host communities. No prior experience is required for beginner courses.",
  },
  {
    question: "Are the courses free?",
    answer:
      "Yes! All our courses are offered free of charge. We believe education should be accessible to everyone regardless of financial circumstances.",
  },
  {
    question: "What materials do I need?",
    answer:
      "We provide all learning materials and computer access at our center. You only need to bring yourself and your willingness to learn.",
  },
  {
    question: "Do I get a certificate?",
    answer:
      "Yes. Upon successful completion of any course, learners receive a certificate of completion that they can use for further education or employment opportunities.",
  },
  {
    question: "Where are classes held?",
    answer:
      "Classes are held at our learning center in Village 3, Kalobeyei Settlement. Some sessions may also be available online for remote learners.",
  },
  {
    question: "How do I apply?",
    answer:
      "You can apply through the form on this website, visit our center in person, or contact us via email or phone. Applications are accepted on a rolling basis.",
  },
];

function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section
      id="faq"
      className="w-full min-h-screen bg-[#f8fafc] pt-24 pb-16 px-6 md:px-12 flex flex-col justify-start relative border-b border-slate-200"
    >
      {/* Inline Keyframes */}
      <style>{`
        @keyframes headColorShift {
          0%, 100% { color: #8A0030; }
          50% { color: #0f172a; }
          75% { color: #205E7A; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Section Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-center mb-2 animate-[headColorShift_8s_infinite_ease-in-out]">
          Frequently Asked Questions
        </h2>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto text-center mb-10">
          Find answers to common questions about our programs and enrollment.
        </p>
      </div>

      {/* Accordion Rows */}
      <div className="max-w-3xl mx-auto w-full flex flex-col gap-y-3 px-4">
        {faqs.map((faq, index) => {
          const isOpen = activeIndex === index;
          return (
            <div
              key={index}
              className="bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-xl transition-all duration-300 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setActiveIndex(isOpen ? null : index)}
                className="w-full py-4 px-5 flex justify-between items-center text-left font-bold text-slate-800 hover:text-[#8A0030] transition-colors duration-200 text-sm md:text-base gap-x-4"
              >
                <span>{faq.question}</span>
                <span
                  className={`text-slate-400 transition-transform duration-300 transform ${
                    isOpen ? "rotate-180 text-[#8A0030]" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {isOpen && (
                <div className="px-5 pb-4 text-xs md:text-sm text-slate-600 border-t border-slate-100/80 pt-3 animate-[fadeIn_0.3s_ease-out] leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FAQ;
