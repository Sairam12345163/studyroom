import { Link } from "react-router-dom";

const categoryImages = {
  "Web Development": [
    "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
  ],
  "Data Science": [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
  ],
  "Machine Learning": [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
  ],
  "Mobile Development": [
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=400&h=250&fit=crop",
  ],
  "DevOps": [
    "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=250&fit=crop",
  ],
  "Design": [
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=400&h=250&fit=crop",
  ],
  "Business": [
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=400&h=250&fit=crop",
  ],
  "Other": [
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
  ],
};

const getCourseImage = (course) => {
  const images = categoryImages[course.category] || categoryImages["Other"];
  return images[course.title.length % images.length];
};

const CourseCard = ({ course }) => {
  const imageUrl = getCourseImage(course);
  const hasRating = course.ratings?.length > 0;

  return (
    <Link
      to={`/courses/${course._id}`}
      className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-semibold px-2 py-1 rounded-md">
            {course.level}
          </span>
        </div>
        {course.price === 0 && (
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Free
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {course.category}
        </span>

        <h3 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-2 group-hover:text-slate-600 transition-colors flex-1">
          {course.title}
        </h3>

        <p className="text-xs text-slate-400 mb-3">
          {course.instructor?.name || "StudyRoom Instructor"}
        </p>

        {/* Rating */}
        {hasRating ? (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(course.averageRating)
                      ? "text-amber-400"
                      : "text-gray-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-medium text-slate-600">
              {Number(course.averageRating).toFixed(1)}
            </span>
            <span className="text-xs text-slate-400">
              ({course.ratings?.length})
            </span>
          </div>
        ) : (
          <div className="mb-3">
            <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full">
              New
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-50">
          <span className="font-bold text-slate-900 text-sm">
            {course.price === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              `₹${course.price}`
            )}
          </span>
          <span className="text-xs text-slate-400">
            {course.lessons?.length || 0} lessons
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;