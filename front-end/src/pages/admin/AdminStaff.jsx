import { useEffect, useMemo, useState } from "react";
import api from "../../config/axios";

function AdminStaff() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleRows, setScheduleRows] = useState([]);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", phone: "", password: "" });
  const [addStaffLoading, setAddStaffLoading] = useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/staff");
      setStaffList(res.data?.data || []);
    } catch (err) {
      console.error("Lỗi lấy danh sách staff:", err);
      alert("Không thể tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = staffList.filter((staff) => {
      const specialtiesText = (staff.specialties || []).join(" ").toLowerCase();
      const matchesKeyword =
        staff.name?.toLowerCase().includes(keyword) ||
        staff.phone?.toLowerCase().includes(keyword) ||
        specialtiesText.includes(keyword);
      const matchesStatus = statusFilter === "all" || staff.status === statusFilter;
      return matchesKeyword && matchesStatus;
    });

    const sorted = [...filtered];
    if (sortBy === "latest") {
      sorted.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (sortBy === "name_asc") {
      sorted.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi"));
    } else if (sortBy === "name_desc") {
      sorted.sort((a, b) => String(b.name || "").localeCompare(String(a.name || ""), "vi"));
    } else if (sortBy === "busy_first") {
      sorted.sort((a, b) => {
        if (a.status === b.status) return 0;
        return a.status === "busy" ? -1 : 1;
      });
    }

    return sorted;
  }, [staffList, search, statusFilter, sortBy]);

  const totalItems = filteredStaff.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + itemsPerPage);
  const fromItem = totalItems === 0 ? 0 : startIndex + 1;
  const toItem = totalItems === 0 ? 0 : endIndex;

  const pageStart = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const pageEnd = Math.min(totalPages, pageStart + 2);
  const visiblePages = Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => pageStart + index);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const statusBadge = (status) => {
    if (status === "busy") {
      return "rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700";
    }
    return "rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700";
  };

  const statusLabel = (status) => (status === "busy" ? "Đã có lịch" : "Đang rảnh");

  const bookingStatusMeta = (status) => {
    if (status === "completed") return { label: "Hoàn thành", cls: "bg-green-100 text-green-700" };
    if (status === "cancelled") return { label: "Đã hủy", cls: "bg-red-100 text-red-700" };
    if (status === "not_completed") return { label: "Chưa hoàn thành", cls: "bg-rose-100 text-rose-700" };
    if (status === "in_progress") return { label: "Đang thực hiện", cls: "bg-amber-100 text-amber-700" };
    if (status === "confirmed") return { label: "Đã xác nhận", cls: "bg-blue-100 text-blue-700" };
    return { label: "Chờ xác nhận", cls: "bg-slate-100 text-slate-700" };
  };

  const timeSlotLabel = (timeSlot) => {
    if (timeSlot === "morning") return "Sáng";
    if (timeSlot === "afternoon") return "Chiều";
    return timeSlot;
  };

  const openScheduleModal = async (staff) => {
    setSelectedStaff(staff);
    setScheduleRows([]);
    setScheduleLoading(true);

    try {
      const res = await api.get(`/admin/staff/${staff.id}/schedule`);
      setScheduleRows(res.data?.data?.schedules || []);
    } catch (err) {
      console.error("Lỗi tải lịch làm việc:", err);
      alert("Không thể tải lịch làm việc");
    } finally {
      setScheduleLoading(false);
    }
  };

  const totalBusy = staffList.filter(s => s.status === 'busy').length;
  const totalAvailable = staffList.filter(s => s.status === 'available').length;

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email || !newStaff.phone || !newStaff.password) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setAddStaffLoading(true);
      const res = await api.post("/admin/staff", newStaff);
      if (res.data.success) {
        alert("Thêm nhân viên thành công!");
        setNewStaff({ name: "", email: "", phone: "", password: "" });
        setShowAddStaffModal(false);
        fetchStaff(); // Refresh list
      } else {
        alert(res.data.message || "Lỗi thêm nhân viên");
      }
    } catch (err) {
      console.error("Lỗi thêm nhân viên:", err);
      alert(err.response?.data?.message || "Lỗi thêm nhân viên");
    } finally {
      setAddStaffLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) return;

    try {
      await api.delete(`/admin/users/${staffId}`);
      alert("Xóa nhân viên thành công!");
      fetchStaff();
    } catch (err) {
      console.error("Lỗi xóa nhân viên:", err);
      alert(err.response?.data?.message || "Lỗi xóa nhân viên");
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Quản lý nhân viên</h1>
            <p className="mt-1 text-sm text-slate-500">Theo dõi chuyên môn và trạng thái làm việc của đội ngũ nhân viên.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-sm md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-2xl font-bold text-slate-800">{staffList.length}</div>
              <div className="text-slate-500">Tổng nhân viên</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-2xl font-bold text-slate-800">{totalAvailable}</div>
              <div className="text-slate-500">Đang rảnh</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="text-2xl font-bold text-slate-800">{totalBusy}</div>
              <div className="text-slate-500">Đã có lịch</div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, số điện thoại hoặc chuyên môn..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Đang rảnh</option>
            <option value="busy">Đã có lịch</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="latest">Mới thêm gần đây</option>
            <option value="name_asc">Tên A-Z</option>
            <option value="name_desc">Tên Z-A</option>
            <option value="busy_first">Ưu tiên đang có lịch</option>
          </select>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchStaff}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-gray-50"
            >
              Làm mới
            </button>
            <button
              type="button"
              onClick={() => setShowAddStaffModal(true)}
              className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700"
            >
              Thêm nhân viên
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="p-3 text-left">Avatar</th>
              <th className="p-3 text-left">Họ Tên</th>
              <th className="p-3 text-left">Số điện thoại</th>
              <th className="p-3 text-left">Chuyên môn</th>
              <th className="p-3 text-left">Trạng thái làm việc</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {!loading && paginatedStaff.map((staff) => (
              <tr key={staff.id} className="border-b border-gray-100 text-sm">
                <td className="p-3">
                  <img src={`https://i.pravatar.cc/120?img=${(staff.id % 70) + 1}`} alt={staff.name} className="h-12 w-12 rounded-full object-cover" />
                </td>
                <td className="p-3 font-medium text-slate-800">{staff.name}</td>
                <td className="p-3 text-slate-700">{staff.phone || "-"}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {(staff.specialties?.length ? staff.specialties : ["Chưa cập nhật"]).map((specialty) => (
                      <span
                        key={specialty}
                        className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3">
                  <span className={statusBadge(staff.status)}>{statusLabel(staff.status)}</span>
                </td>
                <td className="p-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => openScheduleModal(staff)}
                    className="w-full rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
                  >
                    Xem lịch làm việc
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteStaff(staff.id)}
                    className="w-full rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                  >
                    Xóa nhân viên
                  </button>
                </td>
              </tr>
            ))}

            {loading && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  Đang tải danh sách nhân viên...
                </td>
              </tr>
            )}

            {!loading && paginatedStaff.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  Không có nhân viên phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalItems > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
            <p>
              Hiển thị {fromItem} đến {toItem} của {totalItems} kết quả
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-lg border text-sm font-medium transition ${
                    page === currentPage
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showAddStaffModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Thêm nhân viên mới</h2>
              <button
                type="button"
                onClick={() => setShowAddStaffModal(false)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-slate-600 hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="Nhập họ tên"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mật khẩu</label>
                <input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-gray-50"
                  disabled={addStaffLoading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                  disabled={addStaffLoading}
                >
                  {addStaffLoading ? "Đang thêm..." : "Thêm nhân viên"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedStaff && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-5xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">Lịch làm việc nhân viên</h2>
                <p className="text-sm text-slate-500">
                  {selectedStaff.name} - {selectedStaff.phone || "Chưa có số điện thoại"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStaff(null)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-slate-600 hover:bg-gray-50"
              >
                Đóng
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-xl border border-gray-100">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                  <tr>
                    <th className="p-3 text-left">Mã booking</th>
                    <th className="p-3 text-left">Khách hàng</th>
                    <th className="p-3 text-left">Dịch vụ</th>
                    <th className="p-3 text-left">Ngày</th>
                    <th className="p-3 text-left">Khung giờ</th>
                    <th className="p-3 text-left">Địa chỉ</th>
                    <th className="p-3 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {!scheduleLoading && scheduleRows.map((row) => {
                    const status = bookingStatusMeta(row.status);
                    return (
                    <tr key={row.id} className="border-b border-gray-100 text-sm">
                      <td className="p-3 font-medium text-slate-700">#{row.id}</td>
                      <td className="p-3 text-slate-700">{row.customer_name}</td>
                      <td className="p-3 text-slate-700">{row.service_name}</td>
                      <td className="p-3 text-slate-700">{new Date(row.booking_date).toLocaleDateString("vi-VN")}</td>
                      <td className="p-3 text-slate-700">{timeSlotLabel(row.time_slot)}</td>
                      <td className="p-3 text-slate-600">{row.address}</td>
                      <td className="p-3">
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                    );
                  })}

                  {scheduleLoading && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-500">
                        Đang tải lịch làm việc...
                      </td>
                    </tr>
                  )}

                  {!scheduleLoading && scheduleRows.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-slate-500">
                        Kỹ thuật viên này chưa có lịch được phân công.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStaff;
