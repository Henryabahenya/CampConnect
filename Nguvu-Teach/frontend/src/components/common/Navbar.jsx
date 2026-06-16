import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import logoImage from "../../assets/image/logo/home/Henry/Downloads/logo.jpeg";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "What We Do", href: "#what-we-do" },
  { label: "Courses", href: "#courses" },
  { label: "Events", href: "#events" },
  { label: "FAQ", href: "#faq" },
  { label: "Apply", href: "#apply" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* ─── Fixed Global Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-[100] w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 py-4 md:py-5 px-6 md:px-10 flex flex-row justify-between items-center transition-all duration-300">
        {/* Left — Branding */}
        <a href="#hero" className="flex items-center gap-3 group">
          <img
            src={logoImage}
            alt="Nguvu-Teach Logo"
            className="h-10 w-10 md:h-11 md:w-11 object-contain"
          />
          <span className="text-xl font-black tracking-tight text-slate-900">
            Nguvu-<span className="text-[#205E7A]">Teach</span>
          </span>
        </a>

        {/* Center — Desktop Links */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => {
                  if (link.href === "#contact") {
                    e.preventDefault();
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="text-sm font-medium text-slate-600 hover:text-[#8A0030] hover:bg-[#8A0030]/5 px-3 py-1.5 rounded-xl transition-all duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Right — Get in touch */}
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="hidden lg:inline-flex items-center bg-[#8A0030] text-white px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 hover:bg-[#6b0024] hover:shadow-md"
        >
          Get in touch
        </a>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(true)}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* ─── Mobile Slide-Out Drawer ─── */}
      <div
        className={`fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed top-0 right-0 z-[120] h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full font-body">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <a
              href="#hero"
              className="flex items-center gap-2"
              onClick={() => setIsOpen(false)}
            >
              <img
                src={logoImage}
                alt="Nguvu-Teach Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-lg font-black text-slate-900">
                Nguvu-<span className="text-[#205E7A]">Teach</span>
              </span>
            </a>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <ul className="space-y-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 hover:bg-[#8A0030]/5 hover:text-[#8A0030] transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="px-5 py-5 border-t border-gray-200">
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-5 py-3 text-sm font-semibold text-white bg-[#8A0030] hover:bg-[#6b0024] rounded-lg transition-colors duration-200 shadow-sm"
            >
              Get in touch
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
