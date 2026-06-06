import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      {/* Thumbnail */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-44 flex items-center justify-center">
        <span className="text-white text-5xl">📚</span>
      </div>

      <div className="p-5">
        {/* Category + Level */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
            {course.category}
          </span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
            {course.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-2">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="text-sm text-gray-500 mb-3">
          By {course.instructor?.name || "Unknown"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400">⭐</span>
          <span className="text-sm font-semibold">{course.averageRating || "0"}</span>
          <span className="text-xs text-gray-400">
            ({course.ratings?.length || 0} reviews)
          </span>
        </div>

        {/* Price + Button */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-700">
            {course.price === 0 ? "FREE" : `₹${course.price}`}
          </span>
          <Link
            to={`/courses/${course._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;