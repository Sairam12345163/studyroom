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

  const categories = [
    "Web Development", "Mobile Development", "Data Science",
    "Machine Learning", "DevOps", "Design", "Business", "Other"
  ];

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
      toast.success("Course created successfully!");
      setShowCourseForm(false);
      setCourseForm({ title: "", description: "", price: "", category: "Web Development", level: "Beginner" });
      fetchMyCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create course.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post(`/courses/${selectedCourse._id}/lessons`, lessonForm);
      toast.success("Lesson added successfully!");
      setShowLessonForm(false);
      setLessonForm({ title: "", description: "", videoUrl: "", duration: "", isFree: false });
      fetchMyCourses();
    } catch (error) {
      toast.error("Failed to add lesson.");
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
      toast.error("Failed to update course.");
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await API.delete(`/courses/${courseId}`);
      toast.success("Course deleted.");
      fetchMyCourses();
    } catch (error) {
      toast.error("Failed to delete course.");
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 bg-white text-slate-800 placeholder-slate-400";

  return (
    <div className="min-h-screen bg-[#fafaf9]">

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-slate-400 text-sm">Instructor</p>
              <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Courses", value: courses.length },
              { label: "Published", value: courses.filter(c => c.isPublished).length },
              { label: "Drafts", value: courses.filter(c => !c.isPublished).length },
              { label: "Total Students", value: courses.reduce((acc, c) => acc + (c.enrolledStudents?.length || 0), 0) },
            ].map((stat, i) => (
              <div key={i} className="bg-slate-50 border border-gray-100 rounded-xl p-4">
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header Row */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-900">My Courses</h2>
          <button
            onClick={() => { setShowCourseForm(!showCourseForm); setShowLessonForm(false); }}
            className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {showCourseForm ? "Cancel" : "Create Course"}
          </button>
        </div>

        {/* Create Course Form */}
        {showCourseForm && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-5">New Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <input type="text" placeholder="Course title *" className={inputClass}
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
              <textarea placeholder="Course description *" rows={3} className={inputClass}
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input type="number" placeholder="Price ₹ (0 = Free)" className={inputClass}
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  required
                />
                <select className={inputClass}
                  value={courseForm.category}
                  onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select className={inputClass}
                  value={courseForm.level}
                  onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                >
                  {["Beginner", "Intermediate", "Advanced"].map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <button type="submit" disabled={submitting}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "Creating..." : "Create Course"}
              </button>
            </form>
          </div>
        )}

        {/* Add Lesson Form */}
        {showLessonForm && selectedCourse && (
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h3 className="font-semibold text-slate-900">Add Lesson</h3>
                <p className="text-sm text-slate-400 mt-0.5">{selectedCourse.title}</p>
              </div>
              <button onClick={() => setShowLessonForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddLesson} className="space-y-4">
              <input type="text" placeholder="Lesson title *" className={inputClass}
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                required
              />
              <textarea placeholder="Lesson description" rows={2} className={inputClass}
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
              />
              <input type="url" placeholder="Video URL (YouTube or direct link)" className={inputClass}
                value={lessonForm.videoUrl}
                onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Duration (minutes)" className={inputClass}
                  value={lessonForm.duration}
                  onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
                />
                <label className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2.5 cursor-pointer hover:bg-slate-50">
                  <input type="checkbox"
                    checked={lessonForm.isFree}
                    onChange={(e) => setLessonForm({ ...lessonForm, isFree: e.target.checked })}
                    className="w-4 h-4 accent-slate-900"
                  />
                  <span className="text-sm text-slate-700 font-medium">Free preview</span>
                </label>
              </div>
              <button type="submit" disabled={submitting}
                className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "Adding..." : "Add Lesson"}
              </button>
            </form>
          </div>
        )}

        {/* Courses List */}
        {loading ? <Loader /> : courses.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-100 rounded-xl">
            <div className="w-16 h-16 bg-slate-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900 mb-1">No courses yet</p>
            <p className="text-slate-400 text-sm">Create your first course to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <div key={course._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-slate-900">{course.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        course.isPublished
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {course.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-1">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>{course.enrolledStudents?.length || 0} students</span>
                      <span>•</span>
                      <span>{course.lessons?.length || 0} lessons</span>
                      <span>•</span>
                      <span>{course.price === 0 ? "Free" : `₹${course.price}`}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setSelectedCourse(course); setShowLessonForm(true); setShowCourseForm(false); }}
                      className="border border-gray-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold hover:border-slate-300 hover:text-slate-900 transition-colors"
                    >
                      + Lesson
                    </button>
                    <button
                      onClick={() => handleTogglePublish(course._id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                        course.isPublished
                          ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                          : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      }`}
                    >
                      {course.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="border border-red-100 text-red-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Lessons */}
                {course.lessons?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Lessons
                    </p>
                    <div className="space-y-1.5">
                      {course.lessons.map((lesson, j) => (
                        <div key={lesson._id} className="flex items-center gap-3 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
                          <span className="w-5 h-5 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {j + 1}
                          </span>
                          <span className="flex-1 font-medium">{lesson.title}</span>
                          <span className="text-slate-400">{lesson.duration || 0}m</span>
                          {lesson.isFree && (
                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded font-semibold">
                              Free
                            </span>
                          )}
                          {lesson.videoUrl && (
                            <span className="bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded font-semibold">
                              Video
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