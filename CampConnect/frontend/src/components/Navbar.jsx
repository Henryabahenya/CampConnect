import { useLocation, useNavigate } from "react-router-dom";
import { useMockAuth } from "../context/MockAuthContext";

/**
 * CampConnect - Enterprise Navbar
 * Clean, centered top navigation with explicit authentication controls.
 */
const Navbar = () => {
  const { user, isAuthenticated, logout } = useMockAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md px-8 flex items-center sticky top-0 z-50">
      <div
        className="flex-none flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="font-extrabold text-lg text-slate-900 tracking-tight">
          CampConnect
        </span>
      </div>

      <div className="flex-1 hidden md:flex justify-center">
        <div className="flex items-center gap-8 text-xs font-semibold text-slate-500">
          <button
            onClick={() => navigate("/")}
            className={`transition-colors ${isActive("/") ? "text-slate-900" : "hover:text-blue-600"}`}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/about")}
            className={`transition-colors ${isActive("/about") ? "text-slate-900" : "hover:text-blue-600"}`}
          >
            About
          </button>
          <button
            onClick={() => navigate("/contact")}
            className={`transition-colors ${isActive("/contact") ? "text-slate-900" : "hover:text-blue-600"}`}
          >
            Contact
          </button>
        </div>
      </div>

      <div className="flex-none flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <button
              onClick={logout}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign out
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-100"
            >
              Dashboard
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/register")}
              className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-100"
            >
              Get Started
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
