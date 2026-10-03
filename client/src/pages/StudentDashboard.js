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
    <div className="min-h-screen bg-[#fafaf9]">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-slate-400 text-sm">Welcome back</p>
              <h1 className="text-2xl font-bold text-slate-900">
                {user?.name}
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: "Enrolled", value: courses.length, icon: "📚" },
              { label: "In Progress", value: courses.length, icon: "⏳" },
              { label: "Completed", value: 0, icon: "✅" },
              { label: "Certificates", value: 0, icon: "🏆" },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 border border-gray-100 rounded-xl p-4">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ),
              title: "Browse Courses",
              desc: "Find new courses to learn",
              link: "/courses",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: "AI Learning Path",
              desc: "Get personalized recommendations",
              link: "/ai-recommender",
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              ),
              title: "My Profile",
              desc: "Update your information",
              link: "/profile",
            },
          ].map((action, i) => (
            <Link
              key={i}
              to={action.link}
              className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors flex-shrink-0">
                {action.icon}
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm group-hover:text-slate-700">
                  {action.title}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* My Courses */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-slate-900">My Courses</h2>
          <Link
            to="/courses"
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            Browse more →
          </Link>
        </div>

        {loading ? (
          <Loader />
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-xl">
            <div className="w-16 h-16 bg-slate-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900 mb-1">No courses yet</p>
            <p className="text-slate-400 text-sm mb-4">
              You haven't enrolled in any courses yet
            </p>
            <Link
              to="/courses"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors"
            >
              Explore Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => (
              <div
                key={course._id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 group"
              >
                <div className="bg-slate-100 h-32 flex items-center justify-center relative overflow-hidden">
                  <div className="text-3xl text-slate-300">📚</div>
                  <div className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-md">
                    Enrolled
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 text-sm mb-0.5 line-clamp-1 group-hover:text-slate-600">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 mb-3">
                    {course.instructor?.name}
                  </p>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-slate-900 h-1.5 rounded-full w-0"></div>
                    </div>
                  </div>
                  <Link
                    to={`/courses/${course._id}`}
                    className="block text-center bg-slate-900 text-white py-2 rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
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