const express = require("express");
const router = express.Router();
const {
  courseAssistant,
  courseRecommender,
  quizGenerator,
} = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

// All AI routes require login
router.post("/assistant", protect, courseAssistant);
router.post("/recommend", protect, courseRecommender);
router.post("/quiz", protect, quizGenerator);

module.exports = router;