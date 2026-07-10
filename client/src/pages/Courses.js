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
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-extrabold text-white mb-4">
            Explore Our Courses 📚
          </h1>
          <p className="text-purple-200 text-lg mb-8">
            Discover 500+ courses across all categories
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search for anything..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-lg"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8 flex flex-wrap gap-4 items-center">
          <span className="font-bold text-gray-700">Filter:</span>

          {/* Category Filter */}
          <select
            className="border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Level Filter */}
          <select
            className="border border-gray-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">All Levels</option>
            {["Beginner", "Intermediate", "Advanced"].map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 ml-2">
            {["Web Development", "Data Science", "Machine Learning", "Design"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(category === cat ? "" : cat)}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                  category === cat
                    ? "bg-purple-600 text-white shadow-md"
                    : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {(category || level || search) && (
            <button
              onClick={() => {
                setCategory("");
                setLevel("");
                setSearch("");
              }}
              className="ml-auto text-red-500 text-sm font-medium hover:text-red-700 transition-colors"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="text-gray-500 mb-6 font-medium">
            Showing{" "}
            <span className="text-purple-600 font-bold">{courses.length}</span>{" "}
            courses{category && ` in "${category}"`}
          </p>
        )}

        {/* Course Grid */}
        {loading ? (
          <Loader />
        ) : courses.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-8xl mb-6">😕</div>
            <p className="text-gray-500 text-2xl font-bold mb-2">
              No courses found
            </p>
            <p className="text-gray-400">
              Try different search terms or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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