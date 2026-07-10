const express = require("express");
const router = express.Router();
const {
  enrollCourse,
  getMyEnrolledCourses,
  checkEnrollment,
  unenrollCourse,
  getPaymentHistory,
} = require("../controllers/enrollmentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/:courseId/enroll", protect, enrollCourse);
router.delete("/:courseId/unenroll", protect, unenrollCourse);
router.get("/:courseId/check", protect, checkEnrollment);
router.get("/my/courses", protect, getMyEnrolledCourses);
router.get("/my/payments", protect, getPaymentHistory);

module.exports = router;