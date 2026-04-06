import { useEffect, useState } from "react";
<<<<<<< HEAD
import api from "../../config/axios";
import { Search, ShieldCheck, ShieldOff, Trash2, RefreshCw } from "lucide-react";
=======
import axios from "axios";
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

  /* ======================
      FETCH USERS
  ====================== */
  const fetchUsers = async () => {
    try {
<<<<<<< HEAD
      const res = await api.get("/users");
      setUsers(res.data.data);
=======
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data.data); // 🔥 đúng với backend của bạn
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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
<<<<<<< HEAD
      await api.delete(`/users/${id}`);
=======
      await axios.delete(`http://localhost:5000/api/users/${id}`);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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
<<<<<<< HEAD
      await api.put(
        `/users/${id}/role`,
=======
      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
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

<<<<<<< HEAD
  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  const fromItem = totalItems === 0 ? 0 : startIndex + 1;
  const toItem = totalItems === 0 ? 0 : endIndex;

  const pageStart = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const pageEnd = Math.min(totalPages, pageStart + 2);
  const visiblePages = Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => pageStart + index);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const roleClass = (role) => {
    if (role === "admin") return "rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700";
    if (role === "staff") return "rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700";
    return "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700";
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800">Quản lý người dùng</h2>
          <p className="text-sm text-slate-500">Tìm kiếm, chỉnh role và quản trị tài khoản hệ thống.</p>
        </div>

          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-[#059669] focus:ring-2 focus:ring-emerald-100"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={fetchUsers}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-4 w-4" />
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md">
      <table className="w-full">
        <thead className="bg-slate-50 text-slate-700">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Tên</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Điện thoại</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-left">Hành động</th>
=======
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Quản lý người dùng</h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Tìm theo tên hoặc email..."
        className="form-control mb-3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Điện thoại</th>
            <th>Role</th>
            <th>Hành động</th>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
          </tr>
        </thead>

        <tbody>
<<<<<<< HEAD
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <tr key={user.id} className="border-t border-slate-100 text-sm">
                <td className="p-3 font-medium text-slate-600">#{user.id}</td>
                <td className="p-3 text-slate-800">{user.name}</td>
                <td className="p-3 text-slate-600">{user.email}</td>
                <td className="p-3 text-slate-600">{user.phone}</td>

                <td className="p-3">
                  <span className={roleClass(user.role)}>{user.role}</span>
                </td>

                <td className="p-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                  <button
                    title={user.role === "admin" ? "Hạ quyền" : "Nâng admin"}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition hover:bg-amber-200"
=======
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>

                {/* ROLE */}
                <td>
                  <span
                    className={
                      user.role === "admin"
                        ? "badge bg-danger"
                        : "badge bg-success"
                    }
                  >
                    {user.role}
                  </span>
                </td>

                {/* ACTION */}
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
                    onClick={() =>
                      handleChangeRole(user.id, user.role)
                    }
                  >
<<<<<<< HEAD
                    {user.role === "admin" ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  </button>

                  <button
                    title="Xóa người dùng"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-700 transition hover:bg-rose-200"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  </div>
=======
                    {user.role === "admin"
                      ? "Hạ quyền"
                      : "Nâng admin"}
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Xoá
                  </button>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
                </td>
              </tr>
            ))
          ) : (
            <tr>
<<<<<<< HEAD
              <td colSpan="6" className="p-8 text-center text-slate-500">
=======
              <td colSpan="6" className="text-center">
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
                Không có user nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
<<<<<<< HEAD

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
=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    </div>
  );
}

export default AdminUsers;