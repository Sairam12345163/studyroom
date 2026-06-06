import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 to-purple-700 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-6 leading-tight">
          Learn Without Limits 🚀
        </h1>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of students learning from expert instructors.
          Build real skills with hands-on courses.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            to="/courses"
            className="bg-white text-blue-700 px-8 py-3 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg"
          >
            Browse Courses
          </Link>
          {!user && (
            <Link
              to="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-blue-700 transition"
            >
              Get Started Free
            </Link>
          )}
        </div>
      </div>

      {/* Stats Section — Just display cards, NOT buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto py-16 px-6">
        {[
          { icon: "🎓", stat: "10,000+", label: "Students Enrolled" },
          { icon: "📚", stat: "500+", label: "Courses Available" },
          { icon: "👨‍🏫", stat: "100+", label: "Expert Instructors" },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-8 text-center"
          >
            <div className="text-5xl mb-3">{item.icon}</div>
            <div className="text-3xl font-extrabold text-blue-700 mb-1">
              {item.stat}
            </div>
            <div className="text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Categories Section */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "💻", name: "Web Development" },
            { icon: "📱", name: "Mobile Development" },
            { icon: "📊", name: "Data Science" },
            { icon: "🤖", name: "Machine Learning" },
            { icon: "⚙️", name: "DevOps" },
            { icon: "🎨", name: "Design" },
            { icon: "💼", name: "Business" },
            { icon: "🌟", name: "Other" },
          ].map((cat, i) => (
            <Link
              key={i}
              to={`/courses?category=${cat.name}`}
              className="bg-white rounded-xl shadow p-6 text-center hover:shadow-lg hover:bg-blue-50 transition"
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <div className="text-sm font-semibold text-gray-700">{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "1", icon: "📝", title: "Create Account", desc: "Sign up as a student or instructor in seconds" },
              { step: "2", icon: "🔍", title: "Find Your Course", desc: "Browse hundreds of courses across all categories" },
              { step: "3", icon: "🎓", title: "Start Learning", desc: "Enroll and start learning at your own pace" },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;