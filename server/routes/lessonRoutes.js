const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addLesson,
  updateLesson,
  deleteLesson,
  getLessons,
} = require("../controllers/lessonController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

router.get("/", getLessons);
router.post("/", protect, authorizeRole("instructor"), addLesson);
router.put("/:lessonId", protect, authorizeRole("instructor"), updateLesson);
router.delete("/:lessonId", protect, authorizeRole("instructor"), deleteLesson);

module.exports = router;