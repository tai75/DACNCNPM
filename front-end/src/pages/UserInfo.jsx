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
  const [totalBookings, setTotalBookings] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const profileRes = await axios.get("/users/profile");
        const userData = profileRes.data?.data;

        const bookingsRes = await axios.get("/bookings", { params: { page: 1, limit: 1 } });
        setTotalBookings(bookingsRes.data?.pagination?.totalItems || 0);

        if (!userData) {
          setError("Không thể tải thông tin người dùng");
          setLoading(false);
          return;
        }

        const storedUser = localStorage.getItem("user");
        const parsedStoredUser = storedUser ? JSON.parse(storedUser) : {};
        localStorage.setItem("user", JSON.stringify({ ...parsedStoredUser, ...userData }));

        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
        });
        setLoading(false);
      } catch (err) {
        setError("Không thể tải thông tin người dùng");
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
      await axios.put("/users/profile", {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
      });

      const profileRes = await axios.get("/users/profile");
      const updatedUser = profileRes.data?.data || { ...user, ...formData };
      const storedUser = localStorage.getItem("user");
      const parsedStoredUser = storedUser ? JSON.parse(storedUser) : {};
      localStorage.setItem("user", JSON.stringify({ ...parsedStoredUser, ...updatedUser }));
      setUser(updatedUser);
      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      });
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể cập nhật thông tin");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-4 text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-8 md:py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 md:text-4xl">Thông tin cá nhân</h1>
          <p className="mt-2 text-slate-600">Quản lý thông tin tài khoản của bạn</p>
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
                <p className="text-sm text-slate-500">Khách hàng Garden Care</p>
              </div>
            </div>
          </div>

          {/* Info Content */}
          <div className="p-6 md:p-8">
            {isEditing ? (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Họ tên</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Nhập họ tên"
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
                  <p className="mt-1 text-xs text-slate-500">Email không thể thay đổi</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Địa chỉ</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Nhập địa chỉ"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <Save className="h-4 w-4" />
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Name */}
                <div className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Họ tên</p>
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
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Số điện thoại</p>
                      <p className="mt-1 text-base font-medium text-slate-800">{user?.phone || "---"}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start justify-between rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-emerald-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Địa chỉ</p>
                      <p className="mt-1 text-base font-medium text-slate-800">{user?.address || "---"}</p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Chỉnh sửa thông tin
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Trạng thái tài khoản</p>
            <p className="mt-2 text-lg font-semibold text-emerald-600">Hoạt động</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Vai trò</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">
              {user?.role === "user" ? "Khách hàng" : user?.role || "---"}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">Số đơn đã đặt</p>
            <p className="mt-2 text-lg font-semibold text-slate-800">{totalBookings}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
