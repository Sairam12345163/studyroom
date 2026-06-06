const mongoose = require("mongoose");

// ─── Lesson Schema (sub-document) ────────────────────
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lesson title is required"],
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  videoUrl: {
    type: String,       // Cloudinary video URL (added later)
    default: "",
  },
  duration: {
    type: Number,       // duration in minutes
    default: 0,
  },
  order: {
    type: Number,       // lesson order (1, 2, 3...)
    required: true,
  },
  isFree: {
    type: Boolean,      // preview lesson (free to watch)
    default: false,
  },
});

// ─── Course Schema ────────────────────────────────────
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",            // links to User model
      required: true,
    },
    thumbnail: {
      type: String,           // Cloudinary image URL (added later)
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      default: 0,             // 0 means free course
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Web Development",
        "Mobile Development",
        "Data Science",
        "Machine Learning",
        "DevOps",
        "Design",
        "Business",
        "Other",
      ],
    },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    lessons: [lessonSchema],  // array of lessons inside course
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        review: {
          type: String,
          default: "",
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,         // instructor must publish manually
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);