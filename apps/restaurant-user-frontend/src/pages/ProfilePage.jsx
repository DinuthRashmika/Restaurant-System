import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import { updateUser } from "../services/userService";

export default function ProfilePage() {
  const { auth, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: auth.fullName || "",
    email: auth.email || "",
    phone: auth.phone || ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await updateUser(auth.userId, formData);
      if (response.success) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        login({ ...auth, ...formData });
        setIsEditing(false);
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <Topbar />

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="mt-1 text-gray-500">Manage your personal information</p>

          {message.text && (
            <div className={`mt-4 rounded-lg px-4 py-3 text-sm ${
              message.type === "success" 
                ? "border border-green-200 bg-green-50 text-green-600"
                : "border border-red-200 bg-red-50 text-red-600"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ${
                  isEditing
                    ? "border-gray-200 bg-white focus:border-orange-500"
                    : "border-gray-100 bg-gray-50 text-gray-500"
                }`}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ${
                  isEditing
                    ? "border-gray-200 bg-white focus:border-orange-500"
                    : "border-gray-100 bg-gray-50 text-gray-500"
                }`}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase text-gray-500">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full rounded-lg border px-4 py-3 text-sm outline-none ${
                  isEditing
                    ? "border-gray-200 bg-white focus:border-orange-500"
                    : "border-gray-100 bg-gray-50 text-gray-500"
                }`}
              />
            </div>

            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-lg bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700 disabled:opacity-60"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        fullName: auth.fullName,
                        email: auth.email,
                        phone: auth.phone
                      });
                    }}
                    className="flex-1 rounded-lg border border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full rounded-lg bg-orange-600 py-3 font-semibold text-white hover:bg-orange-700"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
            <div className="mt-4 grid gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">User ID</span>
                <span className="font-mono text-gray-900">{auth.userId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account Type</span>
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${
                  auth.role === "OWNER"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {auth.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}