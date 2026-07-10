import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

// Helper to extract YouTube video ID
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

// Helper to check if URL is YouTube
const isYouTubeUrl = (url) => {
  if (!url) return false;
  return url.includes("youtube.com") || url.includes("youtu.be");
};

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
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
      // Set first lesson as active by default
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

  // ─── Free Course Direct Enroll ────────────────────
  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll!");
      return navigate("/login");
    }
    setEnrolling(true);
    try {
      await API.post(`/enrollments/${id}/enroll`, {
        paymentMethod: "Free",
      });
      setIsEnrolled(true);
      toast.success("Enrolled successfully! 🎉");
      fetchCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed!");
    } finally {
      setEnrolling(false);
    }
  };

  // ─── Paid Course Payment ──────────────────────────
  const handlePayment = async (method) => {
    if (!user) {
      toast.error("Please login first!");
      return navigate("/login");
    }
    setEnrolling(true);

    try {
      // Show loading toast
      const toastId = toast.loading(
        `Processing ${method} payment of ₹${course.price}...`
      );

      // Simulate payment processing (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Enroll after payment
      await API.post(`/enrollments/${id}/enroll`, {
        paymentMethod: method,
      });

      toast.dismiss(toastId);
      toast.success(`Payment successful via ${method}! 🎉 You are now enrolled!`);
      setIsEnrolled(true);
      fetchCourse();

    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed! Try again.");
    } finally {
      setEnrolling(false);
    }
  };

  // ─── Review Submit ────────────────────────────────
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await API.post(`/courses/${id}/reviews`, review);
      toast.success("Review submitted! ⭐");
      fetchCourse();
      setReview({ rating: 5, review: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review!");
    } finally {
      setSubmittingReview(false);
    }
  };

  // ─── Can Watch Lesson ─────────────────────────────
  const canWatchLesson = (lesson) => {
    return isEnrolled || lesson.isFree;
  };

  // ─── Handle Lesson Click ──────────────────────────
  const handleLessonClick = (lesson) => {
    if (canWatchLesson(lesson)) {
      setActiveLesson(lesson);
      // Scroll to video player
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please enroll to watch this lesson! 🔒");
    }
  };

  // ─── Render Video Player ──────────────────────────
  const renderVideoPlayer = () => {
    if (!activeLesson) return null;

    // Check if can watch this lesson
    if (!canWatchLesson(activeLesson)) {
      return (
        <div className="bg-gray-900 aspect-video flex flex-col items-center justify-center text-white">
          <div className="text-6xl mb-4">🔒</div>
          <p className="text-xl font-bold mb-2">This lesson is locked</p>
          <p className="text-gray-400 text-sm">
            Enroll in the course to watch all lessons
          </p>
        </div>
      );
    }

    // No video URL
    if (!activeLesson.videoUrl) {
      return (
        <div className="bg-gray-900 aspect-video flex flex-col items-center justify-center text-white">
          <div className="text-6xl mb-4">🎬</div>
          <p className="text-xl font-bold mb-2">No video for this lesson</p>
          <p className="text-gray-400 text-sm">
            Instructor hasn't uploaded a video yet
          </p>
        </div>
      );
    }

    // YouTube video
    if (isYouTubeUrl(activeLesson.videoUrl)) {
      const videoId = getYouTubeId(activeLesson.videoUrl);
      if (videoId) {
        return (
          <div className="aspect-video">
            <iframe
              key={activeLesson._id}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`}
              title={activeLesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        );
      }
    }

    // Direct video URL (mp4 etc.)
    return (
      <div className="aspect-video bg-black">
        <video
          key={activeLesson._id}
          controls
          className="w-full h-full"
          src={activeLesson.videoUrl}
        >
          Your browser does not support video playback.
        </video>
      </div>
    );
  };

  if (loading) return <Loader />;
  if (!course) return (
    <div className="text-center mt-20 text-gray-500">Course not found</div>
  );

  const isFree = course.price === 0;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {course.category}
            </span>
            <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {course.level}
            </span>
            {isFree && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                FREE COURSE
              </span>
            )}
          </div>

          <h1 className="text-4xl font-extrabold mb-4">{course.title}</h1>
          <p className="text-purple-100 text-lg mb-6 max-w-3xl">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-purple-200">
            <span>👨‍🏫 {course.instructor?.name}</span>
            {course.ratings?.length > 0 && (
              <span>⭐ {Number(course.averageRating).toFixed(1)} rating</span>
            )}
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
          {activeLesson && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {renderVideoPlayer()}
              <div className="p-5 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  {canWatchLesson(activeLesson) ? (
                    <span className="text-green-500 text-lg">▶️</span>
                  ) : (
                    <span className="text-gray-400 text-lg">🔒</span>
                  )}
                  <h3 className="font-bold text-gray-800 text-lg">
                    {activeLesson.title}
                  </h3>
                  {activeLesson.isFree && (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">
                      FREE
                    </span>
                  )}
                </div>
                {activeLesson.description && (
                  <p className="text-gray-500 text-sm mt-1">
                    {activeLesson.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Lessons List */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                Course Content 📖
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {course.lessons?.length || 0} lessons •{" "}
                {course.lessons?.filter(l => l.isFree).length || 0} free previews
              </p>
            </div>

            {course.lessons?.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-2">📭</div>
                <p className="text-gray-500">No lessons added yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {course.lessons?.map((lesson, index) => {
                  const isActive = activeLesson?._id === lesson._id;
                  const canWatch = canWatchLesson(lesson);

                  return (
                    <div
                      key={lesson._id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`flex items-center gap-4 p-4 transition-all duration-200
                        ${canWatch ? "cursor-pointer hover:bg-purple-50" : "cursor-not-allowed opacity-70"}
                        ${isActive ? "bg-purple-50 border-l-4 border-purple-500" : ""}
                      `}
                    >
                      {/* Number */}
                      <span className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0
                        ${isActive
                          ? "bg-purple-600 text-white"
                          : canWatch
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-500"}`}
                      >
                        {index + 1}
                      </span>

                      {/* Info */}
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${isActive ? "text-purple-700" : "text-gray-800"}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {lesson.duration ? `${lesson.duration} mins` : "No duration"}
                          {lesson.videoUrl && " • 🎬 Video available"}
                        </p>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {lesson.isFree && (
                          <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-0.5 rounded-full">
                            FREE
                          </span>
                        )}
                        {isActive ? (
                          <span className="text-purple-600 text-lg">▶️</span>
                        ) : canWatch ? (
                          <span className="text-gray-400 text-lg">▷</span>
                        ) : (
                          <span className="text-gray-400 text-lg">🔒</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">
                Student Reviews ⭐
              </h2>
              {course.ratings?.length > 0 && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-3xl font-extrabold text-yellow-500">
                    {Number(course.averageRating).toFixed(1)}
                  </span>
                  <div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={`text-lg ${
                          star <= Math.round(course.averageRating)
                            ? "text-yellow-400" : "text-gray-200"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {course.ratings.length} reviews
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              {/* Add Review Form — enrolled students only */}
              {isEnrolled && (
                <div className="bg-purple-50 rounded-xl p-5 mb-6">
                  <h3 className="font-bold text-gray-800 mb-4">
                    Leave a Review ✍️
                  </h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReview({ ...review, rating: star })}
                            className={`text-3xl transition-transform hover:scale-110 ${
                              star <= review.rating ? "opacity-100" : "opacity-30"
                            }`}
                          >
                            ⭐
                          </button>
                        ))}
                        <span className="text-sm text-gray-500 self-center ml-2">
                          {review.rating}/5
                        </span>
                      </div>
                    </div>
                    <textarea
                      placeholder="Share your experience with this course..."
                      rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                      value={review.review}
                      onChange={(e) => setReview({ ...review, review: e.target.value })}
                    />
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50 font-semibold"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review ⭐"}
                    </button>
                  </form>
                </div>
              )}

              {/* Reviews List */}
              {course.ratings?.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-gray-500">
                    No reviews yet.{" "}
                    {isEnrolled ? "Be the first to review!" : "Enroll to leave a review!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.ratings?.map((r, i) => (
                    <div key={i} className="border border-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold">
                          {r.user?.name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">
                            {r.user?.name || "Student"}
                          </p>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-sm ${
                                i < r.rating ? "text-yellow-400" : "text-gray-200"}`}>
                                ★
                              </span>
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
        </div>

        {/* Right — Enroll Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">

            {/* Price */}
            <div className="mb-4">
              {isFree ? (
                <div>
                  <div className="text-4xl font-extrabold text-green-600 mb-1">
                    FREE
                  </div>
                  <p className="text-gray-400 text-sm">
                    No payment required
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-4xl font-extrabold text-purple-700 mb-1">
                    ₹{course.price}
                  </div>
                  <p className="text-gray-400 text-sm">One-time payment</p>
                </div>
              )}
            </div>

            {/* Enroll / Payment Section */}
            {isEnrolled ? (
              <div className="bg-green-50 border border-green-200 text-green-700 text-center py-4 rounded-xl font-bold mb-4 text-lg">
                ✅ You are enrolled!
              </div>
            ) : (
              <div className="mb-4">
                {isFree ? (
                  // Free course — single button
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100"
                  >
                    {enrolling ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Enrolling...
                      </span>
                    ) : (
                      "Enroll for Free 🚀"
                    )}
                  </button>
                ) : (
                  // Paid course — payment options
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-gray-600 text-center mb-3">
                      Choose Payment Method:
                    </p>
                    {[
                      { method: "Razorpay", icon: "💳", color: "from-blue-600 to-blue-700" },
                      { method: "UPI", icon: "📱", color: "from-green-600 to-green-700" },
                      { method: "Card", icon: "🏦", color: "from-purple-600 to-purple-700" },
                    ].map(({ method, icon, color }) => (
                      <button
                        key={method}
                        onClick={() => handlePayment(method)}
                        disabled={enrolling}
                        className={`w-full bg-gradient-to-r ${color} text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2`}
                      >
                        {enrolling ? (
                          <span className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </span>
                        ) : (
                          <>
                            <span>{icon}</span>
                            Pay ₹{course.price} with {method}
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Course Info */}
           {/* Course Info */}
<div className="space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-4">
  <p className="flex items-center gap-3">
    <span className="text-purple-500">📖</span>
    <span>{course.lessons?.length || 0} lessons</span>
  </p>
  <p className="flex items-center gap-3">
    <span className="text-purple-500">📊</span>
    <span>{course.level} level</span>
  </p>
  <p className="flex items-center gap-3">
    <span className="text-purple-500">♾️</span>
    <span>Full lifetime access</span>
  </p>
  <p className="flex items-center gap-3">
    <span className="text-purple-500">🏆</span>
    <span>Certificate of completion</span>
  </p>
  <p className="flex items-center gap-3">
    <span className="text-purple-500">📱</span>
    <span>Access on mobile and desktop</span>
  </p>
  {course.ratings?.length > 0 && (
    <p className="flex items-center gap-3">
      <span className="text-yellow-500">⭐</span>
      <span>
        {Number(course.averageRating).toFixed(1)} average rating
      </span>
    </p>
  )}
</div>

            {/* Free preview note */}
            {!isEnrolled && course.lessons?.filter(l => l.isFree).length > 0 && (
              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700 text-center">
                👀 {course.lessons?.filter(l => l.isFree).length} free preview lessons available!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;