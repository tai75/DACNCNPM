import { useEffect, useState } from "react";
import api from "../../config/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  /* ======================
      FETCH USERS
  ====================== */
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data.data); // 🔥 đúng với backend của bạn
    } catch (err) {
      console.error("Lỗi lấy users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ======================
      DELETE USER
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xoá user này?")) return;

    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi xoá user:", err);
    }
  };

  /* ======================
      CHANGE ROLE
  ====================== */
  const handleChangeRole = async (id, currentRole) => {
    try {
      await api.put(
        `/users/${id}/role`,
        {
          role: currentRole === "admin" ? "user" : "admin",
        }
      );
      fetchUsers();
    } catch (err) {
      console.error("Lỗi cập nhật role:", err);
    }
  };

  /* ======================
      SEARCH FILTER
  ====================== */
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleClass = (role) => {
    if (role === "admin") return "badge-status bg-red-100 text-red-700";
    if (role === "staff") return "badge-status bg-blue-100 text-blue-700";
    return "badge-status bg-green-100 text-green-700";
  };

  return (
    <div className="space-y-5">
      <div className="panel-shell flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Quản lý người dùng</h2>
          <p className="text-sm text-slate-500">Tìm kiếm, chỉnh role và quản trị tài khoản hệ thống.</p>
        </div>

        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          className="w-full md:w-80 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="table-wrap">
      <table className="w-full">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Tên</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Điện thoại</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 text-sm">
                <td className="p-3 font-medium text-slate-600">#{user.id}</td>
                <td className="p-3 text-slate-800">{user.name}</td>
                <td className="p-3 text-slate-600">{user.email}</td>
                <td className="p-3 text-slate-600">{user.phone}</td>

                <td className="p-3">
                  <span className={roleClass(user.role)}>{user.role}</span>
                </td>

                <td className="p-3 space-x-2 whitespace-nowrap">
                  <button
                    className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-amber-300"
                    onClick={() =>
                      handleChangeRole(user.id, user.role)
                    }
                  >
                    {user.role === "admin"
                      ? "Hạ quyền"
                      : "Nâng admin"}
                  </button>

                  <button
                    className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-600"
                    onClick={() => handleDelete(user.id)}
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="p-8 text-center text-slate-500">
                Không có user nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default AdminUsers;