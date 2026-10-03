import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import API from "../utils/axios";

const Home = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await API.get("/courses");
        setCourses(data.courses.slice(0, 6));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-slate-600 text-sm font-medium">
                AI-Powered Learning Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Learn skills that move
              <span className="block text-slate-500">your career forward.</span>
            </h1>

            <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl">
              Master in-demand skills with expert-led courses,
              AI-powered assistance, and personalized learning paths
              designed for your goals.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="bg-slate-900 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-slate-700 transition-colors text-sm"
              >
                Explore Courses
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="bg-white text-slate-700 px-8 py-3.5 rounded-lg font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-sm"
                >
                  Start for Free
                </Link>
              )}
              {user && (
                <Link
                  to="/ai-recommender"
                  className="bg-white text-slate-700 px-8 py-3.5 rounded-lg font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Get AI Recommendations
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Students enrolled" },
              { value: "240+", label: "Courses available" },
              { value: "50+", label: "Expert instructors" },
              { value: "4.8/5", label: "Average rating" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-slate-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              AI POWERED
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3 mb-4">
              Learn smarter with AI
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Three intelligent tools designed to accelerate your learning
              and keep you on track.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: "AI Course Assistant",
                description: "Ask questions while learning and get instant, intelligent answers tailored to your course content.",
                link: user ? null : "/register",
                linkText: "Try it free",
                color: "bg-blue-50 text-blue-600",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                ),
                title: "AI Quiz Generator",
                description: "Generate personalized quizzes from any course content to test your understanding instantly.",
                link: user ? null : "/register",
                linkText: "Try it free",
                color: "bg-emerald-50 text-emerald-600",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "AI Learning Path",
                description: "Get a personalized course roadmap based on your interests, goals, and current skill level.",
                link: "/ai-recommender",
                linkText: "Get recommendations",
                color: "bg-violet-50 text-violet-600",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-lg">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                {feature.link && (
                  <Link
                    to={feature.link}
                    className="text-sm font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
                  >
                    {feature.linkText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {courses.length > 0 && (
        <section className="py-16 px-6 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-10">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                  FEATURED
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">
                  Popular courses
                </h2>
              </div>
              <Link
                to="/courses"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200"
                >
                  {/* Thumbnail */}
                  <div className="bg-slate-100 h-44 flex items-center justify-center relative overflow-hidden">
                    <div className="text-4xl opacity-30">📚</div>
                    <div className="absolute top-3 left-3">
                      <span className="bg-white text-slate-700 text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
                        {course.level}
                      </span>
                    </div>
                    {course.price === 0 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          Free
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <h3 className="font-semibold text-slate-900 mt-1 mb-1 line-clamp-2 group-hover:text-slate-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-400 mb-3">
                      {course.instructor?.name}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                      <span className="font-bold text-slate-900">
                        {course.price === 0 ? "Free" : `₹${course.price}`}
                      </span>
                      <span className="text-xs text-slate-400">
                        {course.lessons?.length || 0} lessons
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
              BROWSE
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-3">
              Explore by category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "💻", name: "Web Development" },
              { icon: "📊", name: "Data Science" },
              { icon: "🤖", name: "Machine Learning" },
              { icon: "📱", name: "Mobile Development" },
              { icon: "⚙️", name: "DevOps" },
              { icon: "🎨", name: "Design" },
              { icon: "💼", name: "Business" },
              { icon: "🌟", name: "Other" },
            ].map((cat, i) => (
              <Link
                key={i}
                to={`/courses?category=${cat.name}`}
                className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-3 hover:shadow-md hover:border-gray-200 transition-all duration-200 group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 px-6 bg-slate-900">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Start learning today
            </h2>
            <p className="text-slate-400 mb-8">
              Join thousands of students building real skills for real careers.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-slate-900 px-8 py-3.5 rounded-lg font-semibold hover:bg-slate-100 transition-colors text-sm"
              >
                Create free account
              </Link>
              <Link
                to="/courses"
                className="border border-slate-600 text-white px-8 py-3.5 rounded-lg font-semibold hover:border-slate-400 transition-colors text-sm"
              >
                Browse courses
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-800 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-semibold text-slate-700">StudyRoom</span>
          </div>
          <p className="text-sm text-slate-400">
            © 2024 StudyRoom. Built by Sairam Vennaboina.
          </p>
          <div className="flex gap-6">
            <Link to="/courses" className="text-sm text-slate-500 hover:text-slate-700">
              Courses
            </Link>
            <Link to="/ai-recommender" className="text-sm text-slate-500 hover:text-slate-700">
              AI Learning
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;