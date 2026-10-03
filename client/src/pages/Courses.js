import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../utils/axios";
import CourseCard from "../components/CourseCard";
import Loader from "../components/Loader";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category");
    if (cat) setCategory(cat);
  }, [location.search]);

  useEffect(() => {
    fetchCourses();
  }, [category, level]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (category) params.category = category;
      if (level) params.level = level;
      if (search) params.search = search;
      const { data } = await API.get("/courses", { params });
      setCourses(data.courses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  const categories = [
    "Web Development", "Mobile Development", "Data Science",
    "Machine Learning", "DevOps", "Design", "Business", "Other"
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-1">
            All Courses
          </h1>
          <p className="text-slate-500 text-sm mb-6">
            Explore our full library of courses
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="flex-1 relative">
              <svg
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 bg-white text-slate-800 placeholder-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center mb-6 pb-6 border-b border-gray-100">
          <span className="text-sm font-medium text-slate-500">Filter:</span>

          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white text-slate-700"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 bg-white text-slate-700"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">All Levels</option>
            {["Beginner", "Intermediate", "Advanced"].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {/* Quick Pills */}
          <div className="flex flex-wrap gap-2">
            {["Web Development", "Data Science", "Machine Learning", "Design"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(category === cat ? "" : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  category === cat
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-gray-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {(category || level || search) && (
            <button
              onClick={() => { setCategory(""); setLevel(""); setSearch(""); }}
              className="ml-auto text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>

        {/* Results */}
        {!loading && (
          <p className="text-sm text-slate-500 mb-6">
            Showing{" "}
            <span className="font-semibold text-slate-900">{courses.length}</span>{" "}
            courses{category ? ` in "${category}"` : ""}
          </p>
        )}

        {loading ? (
          <Loader />
        ) : courses.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-900 font-semibold text-lg mb-1">No courses found</p>
            <p className="text-slate-500 text-sm">
              Try different search terms or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;