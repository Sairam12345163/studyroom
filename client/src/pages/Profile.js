import { useState, useEffect, useRef } from "react";
import API from "../utils/axios";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
    if (user?.role === "student") {
      fetchPaymentHistory();
      fetchEnrolledCourses();
    } else {
      fetchInstructorCourses();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/users/profile");
      setProfile(data.user);
      setForm({ name: data.user.name, bio: data.user.bio || "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const { data } = await API.get("/enrollments/my/payments");
      setPaymentHistory(data.paymentHistory);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await API.get("/enrollments/my/courses");
      setCourses(data.courses);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInstructorCourses = async () => {
    try {
      const { data } = await API.get("/courses/instructor/mycourses");
      setCourses(data.courses);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put("/users/profile", form);
      toast.success("Profile updated! ✅");
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error("Failed to update profile!");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return toast.error("Please upload JPG, PNG or WebP image!");
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB!");
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const { data } = await API.post("/users/profile/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setProfile({ ...profile, avatar: data.avatar });
      toast.success("Profile photo updated! 🎉");
    } catch (error) {
      toast.error("Failed to upload image!");
    } finally {
      setUploadingImage(false);
    }
  };

  if (loading) return <Loader />;

  const totalSpent = paymentHistory.reduce(
    (acc, p) => acc + (p.amount || 0), 0
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header Banner */}
      <div className={`py-16 px-6 ${
        user?.role === "instructor"
          ? "bg-gradient-to-r from-purple-600 to-blue-600"
          : "bg-gradient-to-r from-blue-600 to-cyan-500"
      }`}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-6">

          {/* Avatar with Upload */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
              {profile?.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-white flex items-center justify-center text-4xl font-extrabold text-blue-700">
                  {profile?.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploadingImage}
              className="absolute bottom-0 right-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-lg border-2 border-white"
            >
              {uploadingImage ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <span className="text-sm">📷</span>
              )}
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>

          {/* Info */}
          <div className="text-white flex-1">
            <h1 className="text-3xl font-bold">{profile?.name}</h1>
            <p className="text-blue-100">{profile?.email}</p>
            <span className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-bold capitalize
              ${user?.role === "instructor"
                ? "bg-purple-200 text-purple-800"
                : "bg-blue-200 text-blue-800"}`}
            >
              {user?.role === "instructor" ? "👨‍🏫 Instructor" : "🎓 Student"}
            </span>
            {profile?.bio && (
              <p className="text-blue-100 mt-2 text-sm">{profile.bio}</p>
            )}
            <p className="text-blue-200 text-xs mt-1">
              Click the 📷 icon to update your photo
            </p>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setEditing(!editing)}
            className="bg-white text-blue-700 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            {editing ? "Cancel" : "✏️ Edit Profile"}
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Edit Form */}
        {editing && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Edit Profile ✏️
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about yourself..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes ✅"}
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {user?.role === "student" ? (
            <>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <div className="text-3xl font-extrabold text-blue-600">
                  {courses.length}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Courses Enrolled
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <div className="text-3xl font-extrabold text-green-600">
                  {paymentHistory.length}
                </div>
                <div className="text-gray-500 text-sm mt-1">Purchases</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <div className="text-3xl font-extrabold text-purple-600">
                  ₹{totalSpent}
                </div>
                <div className="text-gray-500 text-sm mt-1">Total Spent</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <div className="text-3xl font-extrabold text-yellow-500">0</div>
                <div className="text-gray-500 text-sm mt-1">Certificates</div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <div className="text-3xl font-extrabold text-blue-600">
                  {courses.length}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Courses Created
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <div className="text-3xl font-extrabold text-green-600">
                  {courses.filter((c) => c.isPublished).length}
                </div>
                <div className="text-gray-500 text-sm mt-1">Published</div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <div className="text-3xl font-extrabold text-purple-600">
                  {courses.reduce(
                    (acc, c) => acc + (c.enrolledStudents?.length || 0), 0
                  )}
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Total Students
                </div>
              </div>
              <div className="bg-white rounded-xl shadow p-5 text-center">
                <div className="text-3xl font-extrabold text-yellow-500">
                  ₹{courses.reduce((acc, c) => acc + (c.price || 0), 0)}
                </div>
                <div className="text-gray-500 text-sm mt-1">Total Revenue</div>
              </div>
            </>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          {["profile", "courses", ...(user?.role === "student" ? ["payments"] : [])].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-2 font-semibold transition border-b-2 capitalize ${
                activeTab === tab
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "profile" && "📋 My Info"}
              {tab === "courses" && "📚 My Courses"}
              {tab === "payments" && "💳 Payment History"}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Personal Information
            </h3>
            <div className="space-y-4">
              {[
                { icon: "👤", label: "Full Name", value: profile?.name },
                { icon: "📧", label: "Email Address", value: profile?.email },
                { icon: "🎭", label: "Role", value: profile?.role },
                {
                  icon: "📅",
                  label: "Member Since",
                  value: new Date(profile?.createdAt).toLocaleDateString(
                    "en-IN",
                    { year: "numeric", month: "long", day: "numeric" }
                  ),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-xs text-gray-400">{item.label}</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
              {profile?.bio && (
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="text-xs text-gray-400">Bio</p>
                    <p className="font-semibold text-gray-800">{profile.bio}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div>
            {courses.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-500 text-xl">No courses yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white rounded-xl shadow p-5 flex gap-4 hover:shadow-lg transition"
                  >
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      📚
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 mb-1">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">
                        {course.category} • {course.level}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                          📖 {course.lessons?.length || 0} lessons
                        </span>
                        {user?.role === "instructor" && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            course.isPublished
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {course.isPublished ? "✅ Published" : "⏳ Draft"}
                          </span>
                        )}
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                          {course.price === 0 ? "FREE" : `₹${course.price}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === "payments" && user?.role === "student" && (
          <div>
            {paymentHistory.length === 0 ? (
              <div className="bg-white rounded-2xl shadow p-12 text-center">
                <div className="text-6xl mb-4">💳</div>
                <p className="text-gray-500 text-xl">No payments yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl p-6 mb-6">
                  <p className="text-green-100 text-sm">Total Amount Spent</p>
                  <p className="text-4xl font-extrabold">₹{totalSpent}</p>
                  <p className="text-green-100 text-sm mt-1">
                    {paymentHistory.length} transactions
                  </p>
                </div>

                {paymentHistory.map((payment, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow p-5 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                        💳
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">
                          {payment.courseTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {payment.paymentMethod} •{" "}
                          {new Date(payment.paymentDate).toLocaleDateString(
                            "en-IN",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-green-600 text-lg">
                        {payment.amount === 0 ? "FREE" : `₹${payment.amount}`}
                      </p>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        ✅ {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;