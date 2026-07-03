/**
 * CampConnect — Contact Page
 */
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [phone, setPhone] = useState("+254 768 407 749");
  const [email, setEmail] = useState("abahenyahadre@gmail.com");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL || "";
        const res = await fetch(`${base}/api/config/hotlines`);
        if (!res.ok) throw new Error("Failed to fetch contacts");
        const data = await res.json();
        if (data?.contacts && data.contacts.length) {
          // prefer 'security' or first emergency contact
          const emergency =
            data.contacts.find((c) => c.type === "emergency") ||
            data.contacts[0];
          if (emergency?.baseline) setPhone(emergency.baseline);
        }
        if (data?.adminEmail) setEmail(data.adminEmail);
      } catch (err) {
        console.error("Contact fetch error:", err);
      }
    };

    fetchContacts();
  }, []);

  return (
    <div className="py-20 px-8 max-w-3xl mx-auto text-left animate-fade-in">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
        Contact Administration
      </h1>
      <p className="text-slate-500 text-sm mb-12 leading-relaxed">
        For technical assistance, administrative alignment questions, or profile
        coordinate verification issues, use our official contact points below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Phone Line Support
          </span>
          <a
            href={`tel:${phone}`}
            className="text-base font-extrabold text-slate-800 hover:text-blue-600 transition-colors"
          >
            {phone}
          </a>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Email Correspondence
          </span>
          <a
            href={`mailto:${email}`}
            className="text-base font-extrabold text-slate-800 hover:text-blue-600 transition-colors underline"
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  );
}
