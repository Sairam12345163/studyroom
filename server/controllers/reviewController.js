const Course = require("../models/Course");

// ─── ADD Review ───────────────────────────────────────
const addReview = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if student is enrolled
    const isEnrolled = course.enrolledStudents.includes(req.user._id);
    if (!isEnrolled) {
      return res.status(403).json({ message: "You must be enrolled to review" });
    }

    // Check if already reviewed
    const alreadyReviewed = course.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: "You already reviewed this course" });
    }

    const { rating, review } = req.body;

    course.ratings.push({ user: req.user._id, rating, review });

    // Recalculate average rating
    const total = course.ratings.reduce((acc, r) => acc + r.rating, 0);
    course.averageRating = (total / course.ratings.length).toFixed(1);

    await course.save();

    res.status(201).json({ message: "Review added successfully!", averageRating: course.averageRating });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET All Reviews of a Course ─────────────────────
const getCourseReviews = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("ratings.user", "name avatar");

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({
      averageRating: course.averageRating,
      totalReviews: course.ratings.length,
      reviews: course.ratings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── DELETE Review ────────────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.ratings = course.ratings.filter(
      (r) => r.user.toString() !== req.user._id.toString()
    );

    // Recalculate average rating
    if (course.ratings.length > 0) {
      const total = course.ratings.reduce((acc, r) => acc + r.rating, 0);
      course.averageRating = (total / course.ratings.length).toFixed(1);
    } else {
      course.averageRating = 0;
    }

    await course.save();

    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addReview, getCourseReviews, deleteReview };