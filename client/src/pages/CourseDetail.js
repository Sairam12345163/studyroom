import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);
  const [review, setReview] = useState({ rating: 5, review: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchCourse();
    if (user) checkEnrollment();
  }, [id, user]);

  const fetchCourse = async () => {
    try {
      const { data } = await API.get(`/courses/${id}`);
      setCourse(data.course);
      if (data.course.lessons?.length > 0) {
        setActiveLesson(data.course.lessons[0]);
      }
    } catch (error) {
      toast.error("Course not found!");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    try {
      const { data } = await API.get(`/enrollments/${id}/check`);
      setIsEnrolled(data.isEnrolled);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEnroll = async () => {
    if (!user) return toast.error("Please login to enroll!");
    setEnrolling(true);
    try {
      await API.post(`/enrollments/${id}/enroll`);
      setIsEnrolled(true);
      toast.success("Enrolled successfully! 🎉");
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed!");
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await API.post(`/courses/${id}/reviews`, review);
      toast.success("Review submitted! ⭐");
      fetchCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review!");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!course) return <div className="text-center mt-20">Course not found</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-700 to-purple-700 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="bg-white text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
            {course.category}
          </span>
          <h1 className="text-4xl font-extrabold mt-4 mb-4">{course.title}</h1>
          <p className="text-blue-100 text-lg mb-6 max-w-3xl">{course.description}</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <span>👨‍🏫 {course.instructor?.name}</span>
            <span>⭐ {course.averageRating || 0} rating</span>
            <span>👥 {course.enrolledStudents?.length || 0} students</span>
            <span>📖 {course.lessons?.length || 0} lessons</span>
            <span>📊 {course.level}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Video Player */}
          {isEnrolled && activeLesson && (
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="bg-black aspect-video flex items-center justify-center">
                {activeLesson.videoUrl ? (
                  <video
                    key={activeLesson.videoUrl}
                    controls
                    className="w-full h-full"
                    src={activeLesson.videoUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="text-white text-center">
                    <div className="text-6xl mb-3">🎬</div>
                    <p className="text-gray-400">No video uploaded for this lesson</p>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-800 text-lg">
                  {activeLesson.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  {activeLesson.description}
                </p>
              </div>
            </div>
          )}

          {/* Lessons List */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Course Content 📖
            </h2>
            <p className="text-gray-500 mb-4">
              {course.lessons?.length || 0} lessons
            </p>

            {course.lessons?.length === 0 ? (
              <div className="bg-white rounded-xl p-8 shadow text-center">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-500">No lessons added yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {course.lessons?.map((lesson, index) => (
                  <div
                    key={lesson._id}
                    onClick={() => isEnrolled && setActiveLesson(lesson)}
                    className={`bg-white rounded-xl p-4 shadow flex justify-between items-center transition
                      ${isEnrolled ? "cursor-pointer hover:bg-blue-50 hover:shadow-md" : ""}
                      ${activeLesson?._id === lesson._id ? "border-2 border-blue-500 bg-blue-50" : ""}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm
                        ${activeLesson?._id === lesson._id
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700"}`}
                      >
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-800">{lesson.title}</p>
                        <p className="text-xs text-gray-500">
                          {lesson.duration ? `${lesson.duration} mins` : "No duration set"}
                        </p>
                      </div>
                    </div>
                    <div>
                      {lesson.isFree ? (
                        <span className="text-green-600 text-xs font-semibold bg-green-100 px-2 py-1 rounded-full">
                          FREE
                        </span>
                      ) : isEnrolled ? (
                        <span className="text-blue-600 text-xl">▶️</span>
                      ) : (
                        <span className="text-gray-400 text-lg">🔒</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Student Reviews ⭐
            </h2>

            {/* Add Review Form */}
            {isEnrolled && (
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <h3 className="font-bold text-gray-800 mb-4">Leave a Review</h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReview({ ...review, rating: star })}
                          className={`text-2xl transition ${
                            star <= review.rating ? "opacity-100" : "opacity-30"
                          }`}
                        >
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    placeholder="Share your experience..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={review.review}
                    onChange={(e) => setReview({ ...review, review: e.target.value })}
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {course.ratings?.length === 0 ? (
              <div className="bg-white rounded-xl p-6 shadow text-center">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-gray-500">No reviews yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {course.ratings?.map((r, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {r.user?.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {r.user?.name || "Student"}
                        </p>
                        <div className="flex">
                          {[...Array(r.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400 text-sm">⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{r.review}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Enroll Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <div className="text-4xl font-extrabold text-blue-700 mb-1">
              {course.price === 0 ? "FREE" : `₹${course.price}`}
            </div>
            <p className="text-gray-400 text-sm mb-4">One-time payment</p>

            {isEnrolled ? (
              <div className="bg-green-100 text-green-700 text-center py-3 rounded-lg font-semibold mb-4">
                ✅ You are enrolled!
              </div>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4 disabled:opacity-50"
              >
                {enrolling ? "Enrolling..." : "Enroll Now 🚀"}
              </button>
            )}

            <div className="space-y-3 text-sm text-gray-600 border-t pt-4">
              <p className="flex items-center gap-2">
                <span>📖</span> {course.lessons?.length || 0} lessons
              </p>
              <p className="flex items-center gap-2">
                <span>📊</span> {course.level} level
              </p>
              <p className="flex items-center gap-2">
                <span>♾️</span> Full lifetime access
              </p>
              <p className="flex items-center gap-2">
                <span>🏆</span> Certificate of completion
              </p>
              <p className="flex items-center gap-2">
                <span>⭐</span> {course.averageRating || 0} average rating
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;