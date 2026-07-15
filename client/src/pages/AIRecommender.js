import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const AIRecommender = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    interests: "",
    level: "Beginner",
  });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/ai/recommend", {
        interests: form.interests,
        level: form.level,
        currentCourses: [],
      });
      setRecommendations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-full px-5 py-2 mb-6">
            <span className="text-yellow-400">✨</span>
            <span className="text-white text-sm font-medium">
              Powered by Claude AI
            </span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-4">
            AI Course Recommender 🤖
          </h1>
          <p className="text-purple-200 text-lg">
            Tell us your interests and our AI will create a personalized
            learning path just for you!
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Form */}
        {!recommendations && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-6 flex items-center gap-3">
              <span className="bg-gradient-to-r from-purple-500 to-pink-500 w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg">
                🎯
              </span>
              Tell Us About Yourself
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  What are your interests & goals? *
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. I want to become a web developer, I'm interested in Python and data science, I want to build mobile apps, I want to learn AI/ML..."
                  className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 bg-gray-50 text-gray-800 resize-none"
                  value={form.interests}
                  onChange={(e) =>
                    setForm({ ...form, interests: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Your Current Level
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { value: "Beginner", icon: "🌱", desc: "Just starting out" },
                    { value: "Intermediate", icon: "🚀", desc: "Some experience" },
                    { value: "Advanced", icon: "⚡", desc: "Experienced developer" },
                  ].map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setForm({ ...form, level: l.value })}
                      className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 ${
                        form.level === l.value
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">{l.icon}</div>
                      <div className="font-bold text-gray-800 text-sm">
                        {l.value}
                      </div>
                      <div className="text-gray-500 text-xs mt-1">
                        {l.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !form.interests.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    AI is analyzing your profile...
                  </span>
                ) : (
                  "Get My Personalized Learning Path 🚀"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Recommendations */}
        {recommendations && (
          <div className="space-y-6">
            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-6 text-white text-center">
              <div className="text-4xl mb-3">🌟</div>
              <p className="text-lg font-medium leading-relaxed">
                {recommendations.motivationalMessage}
              </p>
            </div>

            {/* Learning Path */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h3 className="text-xl font-extrabold text-gray-800 mb-4 flex items-center gap-2">
                <span>🗺️</span> Your Personalized Learning Path
              </h3>
              <p className="text-gray-600 leading-relaxed bg-blue-50 rounded-2xl p-4 border border-blue-100">
                {recommendations.learningPath}
              </p>
            </div>

            {/* Recommendations */}
            <h3 className="text-2xl font-extrabold text-gray-800">
              Recommended Categories 📚
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recommendations.recommendations?.map((rec, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-extrabold text-gray-800 text-lg">
                      {rec.category}
                    </h4>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold border capitalize ${priorityColor[rec.priority] || priorityColor.medium}`}>
                      {rec.priority} priority
                    </span>
                  </div>

                  {/* Reason */}
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {rec.reason}
                  </p>

                  {/* Suggested Courses */}
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                      Suggested Courses:
                    </p>
                    <div className="space-y-2">
                      {rec.courses?.map((course, j) => (
                        <div
                          key={j}
                          className="flex items-center gap-2 text-sm"
                        >
                          <span className="w-5 h-5 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {j + 1}
                          </span>
                          <span className="text-gray-700">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Browse Button */}
                  <Link
                    to={`/courses?category=${rec.category}`}
                    className="block text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm"
                  >
                    Browse {rec.category} Courses →
                  </Link>
                </div>
              ))}
            </div>

            {/* Try Again */}
            <div className="text-center">
              <button
                onClick={() => setRecommendations(null)}
                className="bg-white border-2 border-purple-300 text-purple-700 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-all duration-300"
              >
                🔄 Get New Recommendations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommender;