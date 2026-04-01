import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  /* ======================
      FETCH USERS
  ====================== */
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
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
      await axios.delete(`http://localhost:5000/api/users/${id}`);
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
      await axios.put(
        `http://localhost:5000/api/users/${id}/role`,
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
          </tr>
        </thead>

        <tbody>
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
                    onClick={() =>
                      handleChangeRole(user.id, user.role)
                    }
                  >
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
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Không có user nào
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;