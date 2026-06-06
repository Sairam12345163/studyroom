const Course = require("../models/Course");
const User = require("../models/User");

// ─── CREATE Course (Instructor only) ─────────────────
const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, level } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Create course with logged-in instructor's id
    const course = await Course.create({
      title,
      description,
      price: price || 0,
      category,
      level: level || "Beginner",
      instructor: req.user._id,   // from protect middleware
    });

    res.status(201).json({
      message: "Course created successfully!",
      course,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET All Published Courses (Everyone) ────────────
const getAllCourses = async (req, res) => {
  try {
    const { category, level, search } = req.query;

    // Build filter object dynamically
    let filter = { isPublished: true };

    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.title = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const courses = await Course.find(filter)
      .populate("instructor", "name email avatar")  // get instructor details
      .select("-lessons -ratings -enrolledStudents") // exclude heavy fields
      .sort({ createdAt: -1 });                      // newest first

    res.status(200).json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET Single Course by ID ──────────────────────────
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email avatar")
      .populate("ratings.user", "name avatar");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({ course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPDATE Course (Instructor who owns it only) ──────
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if logged-in instructor owns this course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this course" });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Course updated successfully!",
      course: updatedCourse,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── DELETE Course (Instructor who owns it only) ──────
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this course" });
    }

    await Course.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── PUBLISH / UNPUBLISH Course ───────────────────────
const togglePublish = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Toggle publish status
    course.isPublished = !course.isPublished;
    await course.save();

    res.status(200).json({
      message: `Course ${course.isPublished ? "published" : "unpublished"} successfully!`,
      isPublished: course.isPublished,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET Instructor's Own Courses ─────────────────────
const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: courses.length,
      courses,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  togglePublish,
  getMyCourses,
};