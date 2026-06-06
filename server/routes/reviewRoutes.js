const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addReview,
  getCourseReviews,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getCourseReviews);
router.post("/", protect, addReview);
router.delete("/", protect, deleteReview);

module.exports = router;