const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getAllUsers,
} = require("../controllers/userController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");

// 🔒 All routes below are protected (must be logged in)

// GET  /api/users/profile  → get my profile
router.get("/profile", protect, getMyProfile);

// PUT  /api/users/profile  → update my profile
router.put("/profile", protect, updateMyProfile);

// GET  /api/users/all  → only instructors can see all users
router.get("/all", protect, authorizeRole("instructor"), getAllUsers);

module.exports = router;