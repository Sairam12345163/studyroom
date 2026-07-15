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
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white shadow-xl sticky top-0 z-50 backdrop-blur-xl border-b border-white border-opacity-10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold flex items-center gap-2 hover:scale-105 transition-transform"
        >
          📚
          <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            StudyRoom
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/courses"
            className={`text-sm font-medium transition-all duration-200 hover:text-yellow-400 ${
              isActive("/courses") ? "text-yellow-400" : "text-purple-200"
            }`}
          >
            Courses
          </Link>

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-purple-200 hover:text-yellow-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get Started Free
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`/dashboard/${user.role}`}
                className={`text-sm font-medium transition-colors hover:text-yellow-400 ${
                  location.pathname.includes("dashboard")
                    ? "text-yellow-400"
                    : "text-purple-200"
                }`}
              >
                Dashboard
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-20 px-3 py-2 rounded-full transition-all duration-200"
              >
                <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white hidden lg:block">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-40 text-red-300 px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-40 hover:text-red-200 transition-all duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-indigo-900 bg-opacity-95 backdrop-blur-xl border-t border-white border-opacity-10 px-6 py-4 space-y-3">
          <Link
            to="/courses"
            className="block text-purple-200 hover:text-yellow-400 py-2"
            onClick={() => setMenuOpen(false)}
          >
            Courses
          </Link>
          <Link to="/ai-recommender"
          className="text-sm font-medium text-purple-200 hover:text-yellow-400 transition-colors flex items-center gap-1">
            🤖 AI Recommend
            </Link>
          {!user ? (
            <>
              <Link
                to="/login"
                className="block text-purple-200 hover:text-yellow-400 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-2 rounded-full font-bold text-center"
                onClick={() => setMenuOpen(false)}
              >
                Get Started Free
              </Link>
            </>
          ) : (
            <>
              <Link
                to={`/dashboard/${user.role}`}
                className="block text-purple-200 hover:text-yellow-400 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="block text-purple-200 hover:text-yellow-400 py-2"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-red-300 py-2 text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;