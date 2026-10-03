import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out!");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <span className="text-xl font-bold text-slate-800">StudyRoom</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/courses"
            className={`text-sm font-medium transition-colors ${
              isActive("/courses")
                ? "text-slate-800 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Courses
          </Link>

          {user && (
            <>
              <Link
                to="/ai-recommender"
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive("/ai-recommender")
                    ? "text-slate-800 font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Learning
              </Link>

              <Link
                to={`/dashboard/${user.role}`}
                className={`text-sm font-medium transition-colors ${
                  location.pathname.includes("dashboard")
                    ? "text-slate-800 font-semibold"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-slate-800 text-white px-5 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center font-semibold text-white text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden lg:block">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors px-3 py-2"
              >
                Sign out
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-700 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-1">
          <Link
            to="/courses"
            className="block text-slate-700 hover:bg-gray-50 py-2 px-3 rounded-lg text-sm font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Courses
          </Link>
          {user && (
            <>
              <Link
                to="/ai-recommender"
                className="block text-slate-700 hover:bg-gray-50 py-2 px-3 rounded-lg text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                AI Learning
              </Link>
              <Link
                to={`/dashboard/${user.role}`}
                className="block text-slate-700 hover:bg-gray-50 py-2 px-3 rounded-lg text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block text-slate-700 hover:bg-gray-50 py-2 px-3 rounded-lg text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-red-600 hover:bg-red-50 py-2 px-3 rounded-lg text-sm font-medium"
              >
                Sign out
              </button>
            </>
          )}
          {!user && (
            <>
              <Link
                to="/login"
                className="block text-slate-700 hover:bg-gray-50 py-2 px-3 rounded-lg text-sm font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="block bg-slate-800 text-white py-2 px-3 rounded-lg text-sm font-semibold text-center mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;