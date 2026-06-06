const Course = require("../models/Course");

// ─── ADD Lesson to Course ─────────────────────────────
const addLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, description, videoUrl, duration, isFree } = req.body;

    const newLesson = {
      title,
      description,
      videoUrl: videoUrl || "",
      duration: duration || 0,
      order: course.lessons.length + 1,
      isFree: isFree || false,
    };

    course.lessons.push(newLesson);
    await course.save();

    res.status(201).json({
      message: "Lesson added successfully!",
      lessons: course.lessons,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPDATE Lesson ────────────────────────────────────
const updateLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const lesson = course.lessons.id(req.params.lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    const { title, description, videoUrl, duration, isFree } = req.body;

    if (title) lesson.title = title;
    if (description) lesson.description = description;
    if (videoUrl) lesson.videoUrl = videoUrl;
    if (duration) lesson.duration = duration;
    if (isFree !== undefined) lesson.isFree = isFree;

    await course.save();

    res.status(200).json({
      message: "Lesson updated successfully!",
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── DELETE Lesson ────────────────────────────────────
const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    course.lessons = course.lessons.filter(
      (lesson) => lesson._id.toString() !== req.params.lessonId
    );

    await course.save();

    res.status(200).json({ message: "Lesson deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET All Lessons of a Course ──────────────────────
const getLessons = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ lessons: course.lessons });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addLesson, updateLesson, deleteLesson, getLessons };