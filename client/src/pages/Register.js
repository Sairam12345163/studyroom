import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(
        form.name, form.email, form.password, form.role
      );
      toast.success("Account created! 🎉");
      navigate(`/dashboard/${data.user.role}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center px-4 py-12">
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white bg-opacity-10 backdrop-blur-xl border border-white border-opacity-20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link to="/" className="text-3xl font-extrabold text-white">
              📚 StudyRoom
            </Link>
            <h2 className="text-2xl font-bold text-white mt-4">
              Create Account 🎓
            </h2>
            <p className="text-purple-200 mt-1">
              Join thousands of learners today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300">
                  👤
                </span>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-12 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300">
                  📧
                </span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-12 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300">
                  🔒
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-12 py-3 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-300 hover:text-white"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-3">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "student", label: "🎓 Student", desc: "I want to learn" },
                  { value: "instructor", label: "👨‍🏫 Instructor", desc: "I want to teach" },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      form.role === r.value
                        ? "border-yellow-400 bg-yellow-400 bg-opacity-20"
                        : "border-white border-opacity-20 hover:border-opacity-40"
                    }`}
                  >
                    <div className="font-bold text-white">{r.label}</div>
                    <div className="text-purple-300 text-xs mt-1">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black py-3 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </span>
              ) : (
                "Create Account 🚀"
              )}
            </button>
          </form>

          <p className="text-center text-purple-200 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-400 font-bold hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;