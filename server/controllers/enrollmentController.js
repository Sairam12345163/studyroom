const Course = require("../models/Course");
const User = require("../models/User");

// ─── ENROLL in a Course ───────────────────────────────
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!course.isPublished) {
      return res.status(400).json({ message: "Course is not published yet" });
    }

    // Check if already enrolled
    const alreadyEnrolled = course.enrolledStudents.includes(req.user._id);
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Add student to course
    course.enrolledStudents.push(req.user._id);
    await course.save();

    // Add course to student's enrolledCourses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id },
    });

    res.status(200).json({ message: "Enrolled successfully! 🎉" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET My Enrolled Courses ──────────────────────────
const getMyEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "enrolledCourses",
      populate: { path: "instructor", select: "name email" },
    });

    res.status(200).json({
      count: user.enrolledCourses.length,
      courses: user.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── CHECK Enrollment Status ──────────────────────────
const checkEnrollment = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isEnrolled = course.enrolledStudents.includes(req.user._id);

    res.status(200).json({ isEnrolled });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UNENROLL from a Course ───────────────────────────
const unenrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.enrolledStudents = course.enrolledStudents.filter(
      (id) => id.toString() !== req.user._id.toString()
    );
    await course.save();

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { enrolledCourses: course._id },
    });

    res.status(200).json({ message: "Unenrolled successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  enrollCourse,
  getMyEnrolledCourses,
  checkEnrollment,
  unenrollCourse,
};