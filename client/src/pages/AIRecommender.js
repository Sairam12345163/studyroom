import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/axios";

const AIRecommender = () => {
  const [form, setForm] = useState({ interests: "", level: "Beginner" });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.post("/ai/recommend", {
        interests: form.interests,
        level: form.level,
        currentCourses: [],
      });
      setRecommendations(data);
    } catch (error) {
      setError("AI recommendation is temporarily unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Learning Path</h1>
              <p className="text-slate-400 text-sm">
                Get personalized course recommendations powered by Claude AI
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Form */}
        {!recommendations && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
            <h2 className="font-semibold text-slate-900 mb-5">Tell us about yourself</h2>
            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  What are your interests and goals? *
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. I want to become a web developer, I'm interested in Python and data science, I want to build mobile apps..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 text-slate-800 placeholder-slate-400 resize-none"
                  value={form.interests}
                  onChange={(e) => setForm({ ...form, interests: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your current level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "Beginner", label: "Beginner", desc: "Just starting out" },
                    { value: "Intermediate", label: "Intermediate", desc: "Some experience" },
                    { value: "Advanced", label: "Advanced", desc: "Experienced" },
                  ].map((l) => (
                    <button
                      key={l.value}
                      type="button"
                      onClick={() => setForm({ ...form, level: l.value })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        form.level === l.value
                          ? "border-slate-900 bg-slate-50"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="font-semibold text-slate-900 text-sm">{l.label}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{l.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !form.interests.trim()}
                className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    AI is analyzing your profile...
                  </span>
                ) : (
                  "Get My Learning Path"
                )}
              </button>
            </form>
          </div>
        )}

        {/* Results */}
        {recommendations && (
          <div className="space-y-5">

            {/* Motivational Message */}
            <div className="bg-slate-900 text-white rounded-xl p-6">
              <p className="text-slate-300 text-sm leading-relaxed">
                {recommendations.motivationalMessage}
              </p>
            </div>

            {/* Learning Path */}
            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Your Learning Path
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-lg p-4 border border-gray-100">
                {recommendations.learningPath}
              </p>
            </div>

            {/* Recommendations */}
            <h3 className="font-semibold text-slate-900">Recommended Categories</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.recommendations?.map((rec, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-semibold text-slate-900">{rec.category}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold border capitalize ${
                      rec.priority === "high"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : rec.priority === "medium"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-emerald-50 text-emerald-600 border-emerald-100"
                    }`}>
                      {rec.priority}
                    </span>
                  </div>

                  <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                    {rec.reason}
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Suggested courses
                    </p>
                    <div className="space-y-1.5">
                      {rec.courses?.map((course, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-slate-600">
                          <span className="w-5 h-5 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {j + 1}
                          </span>
                          {course}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/courses?category=${rec.category}`}
                    className="block text-center bg-slate-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors"
                  >
                    Browse {rec.category} →
                  </Link>
                </div>
              ))}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={() => setRecommendations(null)}
                className="border border-gray-200 text-slate-600 px-6 py-2.5 rounded-lg text-sm font-semibold hover:border-slate-300 hover:text-slate-900 transition-colors"
              >
                Get New Recommendations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommender;