const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  getAllUsers,
} = require("../controllers/userController");
const { protect, authorizeRole } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);
router.post(
  "/profile/upload-image",
  protect,
  upload.single("avatar"),
  uploadProfileImage
);
router.get("/all", protect, authorizeRole("instructor"), getAllUsers);

module.exports = router;