const User = require("../models/User");
const { cloudinary } = require("../config/cloudinary");

// ─── GET My Profile ───────────────────────────────────
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPDATE My Profile ────────────────────────────────
const updateMyProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPLOAD Profile Image ─────────────────────────────
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // req.file.path is the Cloudinary URL
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.file.path },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile image updated! ✅",
      avatar: req.file.path,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET All Users ────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  getAllUsers,
};