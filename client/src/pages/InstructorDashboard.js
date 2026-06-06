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
      toast.error(error.response?.data?.message || "Failed!");
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Instructor Dashboard 👨‍🏫</h1>
          <p className="text-purple-100 mb-6">Manage your courses, {user?.name}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Courses", value: courses.length, icon: "📚" },
              { label: "Published", value: courses.filter(c => c.isPublished).length, icon: "✅" },
              { label: "Drafts", value: courses.filter(c => !c.isPublished).length, icon: "📝" },
              { label: "Total Students", value: courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0), icon: "👥" },
            ].map((stat, i) => (
              <div key={i} className="bg-white bg-opacity-20 rounded-xl p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-purple-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Create Course Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
          <button
            onClick={() => setShowCourseForm(!showCourseForm)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {showCourseForm ? "✕ Cancel" : "+ Create Course"}
          </button>
        </div>

        {/* Create Course Form */}
        {showCourseForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Course 📝</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <input
                type="text" placeholder="Course Title *"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Course Description *" rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number" placeholder="Price ₹ (0 = Free)"
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  required
                />
                <select
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                >
                  {["Web Development","Mobile Development","Data Science","Machine Learning","DevOps","Design","Business","Other"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                >
                  {["Beginner","Intermediate","Advanced"].map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Course 🚀"}
              </button>
            </form>
          </div>
        )}

        {/* Add Lesson Form */}
        {showLessonForm && selectedCourse && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Add Lesson to: <span className="text-blue-600">{selectedCourse.title}</span>
              </h3>
              <button
                onClick={() => setShowLessonForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >✕</button>
            </div>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <input
                type="text" placeholder="Lesson Title *"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                required
              />
              <textarea
                placeholder="Lesson Description" rows={2}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
              />
              <input
                type="url" placeholder="Video URL (YouTube/Direct link)"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number" placeholder="Duration (minutes)"
                  className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                />
                <label className="flex items-center gap-3 border border-gray-300 rounded-lg px-4 py-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={lessonForm.isFree}
                    onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 font-medium">Free Preview Lesson</span>
                </label>
              </div>
              <button
                type="submit" disabled={submitting}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Lesson 📖"}
              </button>
            </form>
          </div>
        )}

        {/* Courses List */}
        {loading ? <Loader /> : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow">
            <div className="text-7xl mb-4">📭</div>
            <p className="text-gray-700 text-2xl font-bold mb-2">No courses yet!</p>
            <p className="text-gray-400 mb-6">Create your first course to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-gray-800 text-xl">{course.title}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {course.isPublished ? "✅ Published" : "⏳ Draft"}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>👥 {course.enrolledStudents?.length || 0} students</span>
                      <span>📖 {course.lessons?.length || 0} lessons</span>
                      <span>💰 {course.price === 0 ? "FREE" : `₹${course.price}`}</span>
                      <span>⭐ {course.averageRating || 0} rating</span>
                      <span>📊 {course.level}</span>
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
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
                    >
                      + Add Lesson
                    </button>
                    <button
                      onClick={() => handleTogglePublish(course._id)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        course.isPublished
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Lessons Preview */}
                {course.lessons?.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    <p className="text-sm font-semibold text-gray-600 mb-2">Lessons:</p>
                    <div className="space-y-2">
                      {course.lessons.map((lesson, i) => (
                        <div key={lesson._id} className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                          <span className="bg-blue-100 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                            {i + 1}
                          </span>
                          <span className="flex-1 font-medium">{lesson.title}</span>
                          <span className="text-gray-400">{lesson.duration || 0} mins</span>
                          {lesson.isFree && (
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">FREE</span>
                          )}
                          {lesson.videoUrl && (
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">🎬 Video</span>
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