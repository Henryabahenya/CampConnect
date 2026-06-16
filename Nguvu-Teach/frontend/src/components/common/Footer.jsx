import { Link } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              Nguvu-Teach
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering learners in Kalobeyei Settlement through accessible,
              quality education and digital skills training.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#about"
                  className="hover:text-[#8A0030] transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#courses"
                  className="hover:text-[#8A0030] transition-colors"
                >
                  Courses
                </a>
              </li>
              <li>
                <a
                  href="#apply"
                  className="hover:text-[#8A0030] transition-colors"
                >
                  Apply Now
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-[#8A0030] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mt-0.5 text-[#8A0030] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>Kalobeyei Settlement, Village three center</span>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-[#8A0030] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:nguvuteach@gmail.com"
                  className="hover:text-[#8A0030] transition-colors"
                >
                  nguvuteach@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-[#8A0030] flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+254704659108"
                  className="hover:text-[#8A0030] transition-colors"
                >
                  +254704659108
                </a>
              </li>
            </ul>
          </div>

          {/* Our Partners */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Our Partners
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://powerlearnproject.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-[#8A0030] transition-colors"
                >
                  Power Learn Project (PLP)
                </a>
              </li>
              <li>
                <a
                  href="https://www.ilo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-[#8A0030] transition-colors"
                >
                  International Labour Organization (ILO)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500">
          <p>&copy; {currentYear} Nguvu-Teach. All rights reserved.</p>
          <Link
            to="/admin-login"
            className="text-gray-500 hover:text-orange-500 text-xs transition-colors duration-200"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
