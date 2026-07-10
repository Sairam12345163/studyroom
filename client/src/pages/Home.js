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
        setCourses(data.courses.slice(0, 3));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
        {/* Animated Background Circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white text-sm font-medium">
              🚀 India's Fastest Growing EdTech Platform
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Learn Skills That
            <span className="block bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Shape Your Future
            </span>
          </h1>

          <p className="text-xl text-purple-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Join over 10,000+ students mastering in-demand skills with
            world-class instructors. Start your learning journey today!
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <Link
              to="/courses"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Explore Courses 🚀
            </Link>
            {!user && (
              <Link
                to="/register"
                className="bg-white bg-opacity-10 backdrop-blur-sm border-2 border-white border-opacity-30 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-opacity-20 hover:scale-105 transition-all duration-300"
              >
                Join for Free ✨
              </Link>
            )}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 text-white text-opacity-70">
            {[
              { icon: "⭐", text: "4.8/5 Rating" },
              { icon: "🎓", text: "10,000+ Students" },
              { icon: "📚", text: "500+ Courses" },
              { icon: "🏆", text: "100+ Instructors" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span>{item.icon}</span>
                <span className="text-purple-200">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: "🎓", stat: "10,000+", label: "Students Enrolled" },
            { icon: "📚", stat: "500+", label: "Courses Available" },
            { icon: "👨‍🏫", stat: "100+", label: "Expert Instructors" },
            { icon: "🏆", stat: "95%", label: "Success Rate" },
          ].map((item, i) => (
            <div key={i} className="text-center text-white">
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="text-3xl font-extrabold">{item.stat}</div>
              <div className="text-purple-200 text-sm mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-semibold">
            CATEGORIES
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-4 mb-4">
            Browse Top Categories
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Explore our wide range of categories and find the perfect course
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {[
            { icon: "💻", name: "Web Development", color: "from-blue-500 to-cyan-500", count: "120+ courses" },
            { icon: "📱", name: "Mobile Dev", color: "from-purple-500 to-pink-500", count: "80+ courses" },
            { icon: "📊", name: "Data Science", color: "from-green-500 to-teal-500", count: "95+ courses" },
            { icon: "🤖", name: "Machine Learning", color: "from-orange-500 to-red-500", count: "60+ courses" },
            { icon: "⚙️", name: "DevOps", color: "from-indigo-500 to-blue-500", count: "45+ courses" },
            { icon: "🎨", name: "UI/UX Design", color: "from-pink-500 to-rose-500", count: "70+ courses" },
            { icon: "💼", name: "Business", color: "from-yellow-500 to-orange-500", count: "55+ courses" },
            { icon: "🌟", name: "Other", color: "from-gray-500 to-slate-500", count: "30+ courses" },
          ].map((cat, i) => (
            <Link
              key={i}
              to={`/courses?category=${cat.name}`}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-br ${cat.color} p-6 text-white`}>
                <div className="text-4xl mb-3">{cat.icon}</div>
                <div className="font-bold text-lg">{cat.name}</div>
                <div className="text-white text-opacity-80 text-sm mt-1">
                  {cat.count}
                </div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Courses */}
      {courses.length > 0 && (
        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="bg-orange-100 text-orange-700 px-4 py-1 rounded-full text-sm font-semibold">
                FEATURED
              </span>
              <h2 className="text-4xl font-extrabold text-gray-900 mt-4 mb-4">
                Top Courses Right Now
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-48 flex items-center justify-center relative overflow-hidden">
                    <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      📚
                    </span>
                    <div className="absolute top-3 right-3 bg-white bg-opacity-20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                      {course.level}
                    </div>
                  </div>
                  <div className="p-5">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                      {course.category}
                    </span>
                    <h3 className="font-bold text-gray-800 text-lg mt-3 mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3">
                      By {course.instructor?.name}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-extrabold text-purple-700">
                        {course.price === 0 ? "FREE" : `₹${course.price}`}
                      </span>
                      <span className="text-yellow-500 text-sm">
                        ⭐ {course.averageRating || "New"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/courses"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-4 rounded-full font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                View All Courses →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
            HOW IT WORKS
          </span>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-4 mb-4">
            Start Learning in 3 Steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              icon: "📝",
              title: "Create Account",
              desc: "Sign up as a student or instructor in just 30 seconds. No credit card required.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              step: "02",
              icon: "🔍",
              title: "Find Your Course",
              desc: "Browse hundreds of courses across all categories. Filter by level and price.",
              color: "from-purple-500 to-pink-500",
            },
            {
              step: "03",
              icon: "🎓",
              title: "Start Learning",
              desc: "Enroll and start learning at your own pace. Watch videos, take quizzes and earn certificates.",
              color: "from-orange-500 to-red-500",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              <div className={`bg-gradient-to-r ${item.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg`}>
                {item.icon}
              </div>
              <div className="absolute top-6 right-6 text-6xl font-extrabold text-gray-100">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {item.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="bg-white bg-opacity-10 text-white px-4 py-1 rounded-full text-sm font-semibold border border-white border-opacity-20">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl font-extrabold text-white mt-4 mb-4">
              What Our Students Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rahul Sharma",
                role: "Web Developer",
                text: "StudyRoom helped me land my first job! The courses are practical and the instructors are amazing.",
                avatar: "R",
                rating: 5,
              },
              {
                name: "Priya Patel",
                role: "Data Scientist",
                text: "Best platform for learning Data Science. The content is up-to-date and very well structured.",
                avatar: "P",
                rating: 5,
              },
              {
                name: "Arjun Kumar",
                role: "Full Stack Developer",
                text: "I completed 3 courses and got a 40% salary hike. Highly recommend StudyRoom!",
                avatar: "A",
                rating: 5,
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-6 hover:bg-opacity-20 transition-all duration-300"
              >
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">⭐</span>
                  ))}
                </div>
                <p className="text-purple-100 mb-6 leading-relaxed">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-black">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{t.name}</p>
                    <p className="text-purple-300 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-14 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <h2 className="text-4xl font-extrabold text-white mb-4 relative">
            Ready to Start Learning? 🚀
          </h2>
          <p className="text-purple-200 text-lg mb-8 relative">
            Join 10,000+ students already learning on StudyRoom
          </p>
          <div className="flex flex-wrap gap-4 justify-center relative">
            <Link
              to="/register"
              className="bg-white text-purple-700 px-10 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Get Started Free ✨
            </Link>
            <Link
              to="/courses"
              className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-purple-700 transition-all duration-300"
            >
              Browse Courses →
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">📚 StudyRoom</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's fastest growing online learning platform. Learn from the best instructors.
            </p>
          </div>
          {[
            {
              title: "Platform",
              links: ["Browse Courses", "Become Instructor", "Pricing"],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog"],
            },
            {
              title: "Support",
              links: ["Help Center", "Contact Us", "Privacy Policy"],
            },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="font-bold mb-4 text-gray-300">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <span className="text-gray-400 text-sm hover:text-white cursor-pointer transition-colors">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          © 2024 StudyRoom. All rights reserved. Built with ❤️ by Sairam Vennaboina
        </div>
      </footer>
    </div>
  );
};

export default Home;