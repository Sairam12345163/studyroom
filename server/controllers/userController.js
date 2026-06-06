const User = require("../models/User");

// ─── GET My Profile ───────────────────────────────────
const getMyProfile = async (req, res) => {
  try {
    // req.user is already set by protect middleware
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── UPDATE My Profile ────────────────────────────────
const updateMyProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;

    // Find user and update
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true }          // returns updated document
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully!",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ─── GET All Users (Admin/Instructor only) ────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getMyProfile, updateMyProfile, getAllUsers };