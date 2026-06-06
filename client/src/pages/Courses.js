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
    // Read category from URL params
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

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">All Courses 📚</h1>
        <p className="text-gray-500 mb-8">
          Explore our wide range of courses and start learning today
        </p>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search courses..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {["Web Development","Mobile Development","Data Science","Machine Learning","DevOps","Design","Business","Other"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              {["Beginner", "Intermediate", "Advanced"].map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <Loader />
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-gray-500 text-xl">No courses found</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-4">{courses.length} courses found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;