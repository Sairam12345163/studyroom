import { Link } from "react-router-dom";

// Category-based images from Unsplash (free, no API needed)
const categoryImages = {
  "Web Development": [
    "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
  ],
  "Data Science": [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1599658880436-c61792e70672?w=400&h=250&fit=crop",
  ],
  "Machine Learning": [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=250&fit=crop",
  ],
  "Mobile Development": [
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
  ],
  "DevOps": [
    "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
  ],
  "Design": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=250&fit=crop",
  ],
  "Business": [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
  ],
  "Other": [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop",
  ],
};

// Get consistent image for same course
const getCourseImage = (course) => {
  const images = categoryImages[course.category] ||
    categoryImages["Other"];
  // Use course title length to pick consistent image
  const index = course.title.length % images.length;
  return images[index];
};

const CourseCard = ({ course }) => {
  const imageUrl = getCourseImage(course);
  const hasRating = course.ratings?.length > 0;

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            // Fallback if image fails to load
            e.target.style.display = "none";
            e.target.parentElement.classList.add(
              "bg-gradient-to-br",
              "from-indigo-500",
              "to-purple-600",
              "flex",
              "items-center",
              "justify-center"
            );
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black from-0% via-transparent via-50% to-transparent opacity-60"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3">
          <span className="bg-black bg-opacity-50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
            {course.level}
          </span>
        </div>

        {course.price === 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
              FREE
            </span>
          </div>
        )}

        {/* Category on image */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-purple-600 bg-opacity-90 text-white text-xs px-2 py-1 rounded-full font-medium">
            {course.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-2 group-hover:text-purple-600 transition-colors flex-1">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          By {course.instructor?.name || "Unknown"}
        </p>

        {/* Rating — Only show if has reviews */}
        <div className="flex items-center gap-1 mb-4">
          {hasRating ? (
            <>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= Math.round(course.averageRating)
                        ? "text-yellow-400"
                        : "text-gray-200"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {Number(course.averageRating).toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({course.ratings?.length} reviews)
              </span>
            </>
          ) : (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
              ✨ New Course
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-xl font-extrabold text-purple-700">
            {course.price === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `₹${course.price}`
            )}
          </span>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            📖 {course.lessons?.length || 0} lessons
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;