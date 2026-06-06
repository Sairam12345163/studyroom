const express = require("express");
const router = express.Router();
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  togglePublish,
  getMyCourses,
} = require("../controllers/courseController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

// ─── Public Routes (No login needed) ─────────────────
router.get("/", getAllCourses);                  // browse all courses
router.get("/:id", getCourseById);              // view single course

// ─── Instructor Only Routes ───────────────────────────
router.post(
  "/",
  protect,
  authorizeRole("instructor"),
  createCourse
);

router.put(
  "/:id",
  protect,
  authorizeRole("instructor"),
  updateCourse
);

router.delete(
  "/:id",
  protect,
  authorizeRole("instructor"),
  deleteCourse
);

router.put(
  "/:id/publish",
  protect,
  authorizeRole("instructor"),
  togglePublish
);

router.get(
  "/instructor/mycourses",
  protect,
  authorizeRole("instructor"),
  getMyCourses
);

module.exports = router;