import { useState, useEffect } from "react";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showLessonForm, setShowLessonForm] = useState(false);
  const [courseForm, setCourseForm] = useState({
    title: "", description: "", price: "",
    category: "Web Development", level: "Beginner",
  });
  const [lessonForm, setLessonForm] = useState({
    title: "", description: "", videoUrl: "", duration: "", isFree: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchMyCourses(); }, []);

  const fetchMyCourses = async () => {
    try {
      const { data } = await API.get("/courses/instructor/mycourses");
      setCourses(data.courses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/courses", courseForm);
      toast.success("Course created! 🎉");
      setShowCourseForm(false);
      setCourseForm({ title: "", description: "", price: "", category: "Web Development", level: "Beginner" });
      fetchMyCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/courses/${selectedCourse._id}/lessons`, lessonForm);
      toast.success("Lesson added! 📖");
      setShowLessonForm(false);
      setLessonForm({ title: "", description: "", videoUrl: "", duration: "", isFree: false });
      fetchMyCourses();
    } catch (error) {
      toast.error("Failed!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (courseId) => {
    try {
      const { data } = await API.put(`/courses/${courseId}/publish`);
      toast.success(data.message);
      fetchMyCourses();
    } catch (error) {
      toast.error("Failed!");
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Delete this course?")) return;
    try {
      await API.delete(`/courses/${courseId}`);
      toast.success("Course deleted!");
      fetchMyCourses();
    } catch (error) {
      toast.error("Failed!");
    }
  };

  const categories = ["Web Development", "Mobile Development", "Data Science", "Machine Learning", "DevOps", "Design", "Business", "Other"];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-14 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl font-extrabold text-black shadow-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-purple-300 text-sm">Instructor Dashboard</p>
              <h1 className="text-3xl font-extrabold text-white">
                Welcome, {user?.name}! 👨‍🏫
              </h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "📚", label: "Total Courses", value: courses.length, color: "from-blue-400 to-cyan-400" },
              { icon: "✅", label: "Published", value: courses.filter(c => c.isPublished).length, color: "from-green-400 to-teal-400" },
              { icon: "📝", label: "Drafts", value: courses.filter(c => !c.isPublished).length, color: "from-yellow-400 to-orange-400" },
              { icon: "👥", label: "Total Students", value: courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0), color: "from-purple-400 to-pink-400" },
            ].map((stat, i) => (
              <div key={i} className="bg-white bg-opacity-10 backdrop-blur-sm border border-white border-opacity-20 rounded-2xl p-5 text-center hover:bg-opacity-20 transition-all">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-xl mx-auto mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                <div className="text-purple-200 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold text-gray-800">My Courses</h2>
          <button
            onClick={() => { setShowCourseForm(!showCourseForm); setShowLessonForm(false); }}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {showCourseForm ? "✕ Cancel" : "+ Create Course"}
          </button>
        </div>

        {/* Create Course Form */}
        {showCourseForm && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-purple-100">
            <h3 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm">+</span>
              Create New Course
            </h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <input
                type="text" placeholder="Course Title *"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Course Description *" rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number" placeholder="Price ₹ (0 = Free)"
                  className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  required
                />
                <select
                  className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                >
                  {["Beginner", "Intermediate", "Advanced"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Course 🚀"}
              </button>
            </form>
          </div>
        )}

        {/* Add Lesson Form */}
        {showLessonForm && selectedCourse && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-purple-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800">
                Add Lesson to:{" "}
                <span className="text-purple-600">{selectedCourse.title}</span>
              </h3>
              <button
                onClick={() => setShowLessonForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <input
                type="text" placeholder="Lesson Title *"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Lesson Description" rows={2}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
              />
              <input
                type="url" placeholder="🎬 Video URL (YouTube link)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number" placeholder="Duration (minutes)"
                  className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                />
                <label className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer bg-gray-50 hover:bg-purple-50">
                  <input
                    type="checkbox"
                    checked={lessonForm.isFree}
                    onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                    className="w-4 h-4 accent-purple-600"
                  />
                  <span className="text-gray-700 font-medium">Free Preview</span>
                </label>
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl font-bold hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Lesson 📖"}
              </button>
            </form>
          </div>
        )}

        {/* Courses List */}
        {loading ? <Loader /> : courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-md">
            <div className="text-8xl mb-6">📭</div>
            <p className="text-gray-700 text-2xl font-bold mb-2">No courses yet!</p>
            <p className="text-gray-400 mb-8">Create your first course to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course, i) => (
              <div
                key={course._id}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-wrap justify-between items-start gap-4">
                  {/* Left */}
                  <div className="flex gap-4 flex-1">
                    <div className={`bg-gradient-to-br ${
                      ["from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-green-500 to-teal-500"][i % 3]
                    } w-16 h-16 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-md`}>
                      📚
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-extrabold text-gray-800 text-lg">
                          {course.title}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                          course.isPublished
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {course.isPublished ? "✅ Live" : "⏳ Draft"}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-1">
                        {course.description}
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          👥 {course.enrolledStudents?.length || 0} students
                        </span>
                        <span className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                          📖 {course.lessons?.length || 0} lessons
                        </span>
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          💰 {course.price === 0 ? "FREE" : `₹${course.price}`}
                        </span>
                        <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                          ⭐ {course.averageRating || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowLessonForm(true);
                        setShowCourseForm(false);
                      }}
                      className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
                    >
                      + Lesson
                    </button>
                    <button
                      onClick={() => handleTogglePublish(course._id)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                        course.isPublished
                          ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Lessons Preview */}
                {course.lessons?.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-sm font-bold text-gray-600 mb-3">
                      Lessons ({course.lessons.length})
                    </p>
                    <div className="space-y-2">
                      {course.lessons.map((lesson, j) => (
                        <div
                          key={lesson._id}
                          className="flex items-center gap-3 text-sm bg-gray-50 rounded-xl px-4 py-3"
                        >
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {j + 1}
                          </span>
                          <span className="flex-1 font-medium text-gray-700">
                            {lesson.title}
                          </span>
                          <span className="text-gray-400 text-xs">
                            {lesson.duration || 0} mins
                          </span>
                          {lesson.isFree && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                              FREE
                            </span>
                          )}
                          {lesson.videoUrl && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                              🎬 Video
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;