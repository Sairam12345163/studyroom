import { useState, useEffect } from "react";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await API.get("/enrollments/my/courses");
      setCourses(data.courses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-14 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-black shadow-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-purple-300 text-sm">Welcome back,</p>
              <h1 className="text-3xl font-extrabold text-white">
                {user?.name}! 👋
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "📚", label: "Enrolled", value: courses.length, color: "from-blue-400 to-cyan-400" },
              { icon: "⏳", label: "In Progress", value: courses.length, color: "from-yellow-400 to-orange-400" },
              { icon: "✅", label: "Completed", value: 0, color: "from-green-400 to-teal-400" },
              { icon: "🏆", label: "Certificates", value: 0, color: "from-purple-400 to-pink-400" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-5 text-center hover:bg-opacity-20 transition-all"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-xl mx-auto mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="text-purple-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: "🔍",
              title: "Browse Courses",
              desc: "Find new courses to learn",
              link: "/courses",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: "📖",
              title: "Continue Learning",
              desc: `${courses.length} courses in progress`,
              link: "#my-courses",
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: "👤",
              title: "My Profile",
              desc: "Update your information",
              link: "/profile",
              color: "from-orange-500 to-red-500",
            },
          ].map((action, i) => (
            <Link
              key={i}
              to={action.link}
              className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`bg-gradient-to-r ${action.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <div>
                <div className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                  {action.title}
                </div>
                <div className="text-sm text-gray-500">{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* My Courses */}
        <div id="my-courses">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-extrabold text-gray-800">
              My Courses 📚
            </h2>
            <Link
              to="/courses"
              className="text-purple-600 hover:text-purple-800 text-sm font-semibold hover:underline"
            >
              Browse more →
            </Link>
          </div>

          {loading ? (
            <Loader />
          ) : courses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-md">
              <div className="text-8xl mb-6">📭</div>
              <p className="text-gray-700 text-2xl font-bold mb-2">
                No courses yet!
              </p>
              <p className="text-gray-400 mb-8">
                Start your learning journey today
              </p>
              <Link
                to="/courses"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Browse Courses 🚀
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, i) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className={`bg-gradient-to-br ${
                    ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-green-500 to-teal-500"][i % 3]
                  } h-36 flex items-center justify-center relative`}>
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                      📚
                    </span>
                    <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      ✅ Enrolled
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-bold text-gray-800 mb-1 text-lg line-clamp-1 group-hover:text-purple-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      By {course.instructor?.name}
                    </p>
                    <p className="text-xs text-gray-400 mb-4">
                      {course.lessons?.length || 0} lessons • {course.level}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>0%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                          style={{ width: "0%" }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      to={`/courses/${course._id}`}
                      className="block text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-xl hover:shadow-lg transition-all duration-300 text-sm font-semibold"
                    >
                      Continue Learning →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;