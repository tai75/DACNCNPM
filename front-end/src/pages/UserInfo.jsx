import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Phone, MapPin, Save, X } from "lucide-react";
import axios from "../config/axios";

function UserInfo() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          navigate("/login");
          return;
        }
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Kh�ng th? t?i th�ng tin ngu?i d�ng");
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setError("");
      const response = await axios.put("/users/profile", {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      const updatedUser = {
        ...user,
        ...formData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Kh�ng th? c?p nh?t th�ng tin");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-slate-600">�ang t?i...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">Th�ng tin c� nh�n</h1>
          <p className="mt-2 text-slate-600">Qu?n l� th�ng tin t�i kho?n c?a b?n</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-rose-300 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        )}

        {/* User Info Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Avatar Section */}
          <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-50 to-slate-50 px-6 py-8 md:px-8">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-800">{user?.name}</h2>
                <p className="text-sm text-slate-500">Kh�ch h�ng Garden Care</p>
              </div>
            </div>
          </div>

          {/* Info Content */}
          <div className="p-6 md:p-8">
            {isEditing ? (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">H? t�n</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Nh?p h? t�n"
                  />
                </div>

                {/* Email - Read Only */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500 outline-none"
                  />
                  <p className="mt-1 text-xs text-slate-500">Email kh�ng th? thay d?i</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">S? di?n tho?i</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Nh?p s? di?n tho?i"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">�?a ch?</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Nh?p d?a ch?"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <Save className="h-4 w-4" />
                    Luu thay d?i
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    H?y
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">H? t�n</p>
                    <p className="mt-1 text-base font-medium text-slate-800">{user?.name || "---"}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Email</p>
                      <p className="mt-1 text-base font-medium text-slate-800">{user?.email || "---"}</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">S? di?n tho?i</p>
                      <p className="mt-1 text-base font-medium text-slate-800">{user?.phone || "---"}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">�?a ch?</p>
                      <p className="mt-1 text-base font-medium text-slate-800">{user?.address || "---"}</p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Ch?nh s?a th�ng tin
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Tr?ng th�i t�i kho?n</p>
            <p className="mt-2 text-lg font-semibold text-emerald-600">Ho?t d?ng</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Vai tr�</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">
              {user?.role === "user" ? "Kh�ch h�ng" : user?.role || "---"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
