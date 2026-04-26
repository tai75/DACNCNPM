import { useEffect, useMemo, useState } from "react";
import api from "../../config/axios";

const statusLabel = {
  new: "Mới",
  in_progress: "Đang xử lý",
  resolved: "Đã xử lý",
};

const statusClass = {
  new: "bg-amber-100 text-amber-700",
  in_progress: "bg-sky-100 text-sky-700",
  resolved: "bg-emerald-100 text-emerald-700",
};

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadError, setLoadError] = useState("");

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setLoadError("");
      const params = { page: 1, limit: 100 };
      if (statusFilter !== "all") params.status = statusFilter;
      if (searchText.trim()) params.q = searchText.trim();

      const res = await api.get("/contacts", { params });
      setContacts(res.data?.data || []);
    } catch (error) {
      console.error("Load contacts error:", error);
      setLoadError(error?.response?.data?.message || error?.message || "Không thể tải danh sách liên hệ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [statusFilter]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    fetchContacts();
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/contacts/${id}/status`, { status });
      setContacts((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
    } catch (error) {
      console.error("Update contact status error:", error);
      alert(error.response?.data?.message || "Không thể cập nhật trạng thái");
    }
  };

  const handleDelete = async (id) => {
    const accepted = window.confirm("Bạn có chắc muốn xóa liên hệ này?");
    if (!accepted) return;

    try {
      await api.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Delete contact error:", error);
      alert(error.response?.data?.message || "Không thể xóa liên hệ");
    }
  };

  const summary = useMemo(() => {
    return contacts.reduce(
      (acc, item) => {
        acc.total += 1;
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      { total: 0, new: 0, in_progress: 0, resolved: 0 }
    );
  }, [contacts]);

  return (
    <div className="space-y-6">
      <div className="card-soft overflow-hidden bg-gradient-to-r from-slate-900 via-cyan-900 to-emerald-700 p-6 text-white md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Quản lý liên hệ khách hàng</h1>
            <p className="mt-2 max-w-2xl text-sm text-emerald-50/85">
              Theo dõi yêu cầu từ trang Liên hệ, cập nhật trạng thái xử lý và phản hồi khách hàng kịp thời.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center text-sm md:grid-cols-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.total}</div>
              <div className="text-white/75">Tổng liên hệ</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.new}</div>
              <div className="text-white/75">Mới</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.in_progress}</div>
              <div className="text-white/75">Đang xử lý</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur">
              <div className="text-2xl font-bold">{summary.resolved}</div>
              <div className="text-white/75">Đã xử lý</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-soft p-5 md:p-6">
        <form onSubmit={handleSearchSubmit} className="grid gap-3 md:grid-cols-[1fr_220px_140px]">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Tìm theo tên, email, số điện thoại, nội dung..."
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Mới</option>
            <option value="in_progress">Đang xử lý</option>
            <option value="resolved">Đã xử lý</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      <div className="table-wrap">
        {loadError && (
          <div className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        )}
        <table className="w-full min-w-[1100px]">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-4 py-3">Mã</th>
              <th className="px-4 py-3">Khách hàng</th>
              <th className="px-4 py-3">Chủ đề</th>
              <th className="px-4 py-3">Nội dung</th>
              <th className="px-4 py-3">Ngày gửi</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Hành động</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {!loading && contacts.map((contact) => (
              <tr key={contact.id} className="align-top transition hover:bg-slate-50/70">
                <td className="px-4 py-4 font-semibold text-slate-800">#{contact.id}</td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  <div className="font-semibold text-slate-800">{contact.full_name}</div>
                  <div>{contact.email || "--"}</div>
                  <div>{contact.phone || "--"}</div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">{contact.subject || "(Không có chủ đề)"}</td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  <div className="max-w-[380px] whitespace-pre-wrap break-words">{contact.message}</div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {new Date(contact.created_at).toLocaleString("vi-VN")}
                </td>
                <td className="px-4 py-4">
                  <select
                    value={contact.status}
                    onChange={(event) => handleUpdateStatus(contact.id, event.target.value)}
                    className={`w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 ${
                      statusClass[contact.status] || "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <option value="new">Mới</option>
                    <option value="in_progress">Đang xử lý</option>
                    <option value="resolved">Đã xử lý</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(contact.id)}
                    className="rounded-xl bg-rose-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}

            {!loading && contacts.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                  Không có liên hệ nào phù hợp với bộ lọc hiện tại.
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                  Đang tải danh sách liên hệ...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminContacts;
