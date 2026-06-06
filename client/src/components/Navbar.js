import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold tracking-wide">
        📚 StudyRoom
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/courses" className="hover:text-blue-200 transition">
          Courses
        </Link>

        {!user ? (
          <>
            <Link
              to="/login"
              className="hover:text-blue-200 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-100 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              to={`/dashboard/${user.role}`}
              className="hover:text-blue-200 transition"
            >
              Dashboard
            </Link>
            <span className="text-blue-200">Hi, {user.name}! 👋</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;