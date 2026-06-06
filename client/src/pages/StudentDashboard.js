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
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-blue-100 mb-6">Continue your learning journey</p>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Enrolled Courses", value: courses.length, icon: "📚" },
              { label: "In Progress", value: courses.length, icon: "⏳" },
              { label: "Completed", value: 0, icon: "✅" },
              { label: "Certificates", value: 0, icon: "🏆" },
            ].map((stat, i) => (
              <div key={i} className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <Link
            to="/courses"
            className="bg-white rounded-xl shadow p-6 flex items-center gap-4 hover:shadow-lg transition"
          >
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              🔍
            </div>
            <div>
              <div className="font-bold text-gray-800">Browse Courses</div>
              <div className="text-sm text-gray-500">Find new courses</div>
            </div>
          </Link>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              📖
            </div>
            <div>
              <div className="font-bold text-gray-800">My Learning</div>
              <div className="text-sm text-gray-500">{courses.length} courses enrolled</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex items-center gap-4">
            <div className="bg-purple-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <div className="font-bold text-gray-800">Certificates</div>
              <div className="text-sm text-gray-500">0 earned</div>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Courses 📚</h2>
          <Link to="/courses" className="text-blue-600 hover:underline text-sm">
            Browse more →
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <div className="text-7xl mb-4">📭</div>
            <p className="text-gray-700 text-2xl font-bold mb-2">
              No courses yet!
            </p>
            <p className="text-gray-400 mb-6">
              Start your learning journey today
            </p>
            <Link
              to="/courses"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Browse Courses 🚀
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                {/* Thumbnail */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-36 flex items-center justify-center relative">
                  <span className="text-white text-5xl">📚</span>
                  <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Enrolled ✅
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="font-bold text-gray-800 mb-1 text-lg line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-1">
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
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "0%" }}
                      ></div>
                    </div>
                  </div>

                  <Link
                    to={`/courses/${course._id}`}
                    className="block text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
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
  );
};

export default StudentDashboard;