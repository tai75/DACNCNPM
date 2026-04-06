import { useEffect, useState } from "react";
<<<<<<< HEAD
import api from "../../config/axios";
=======
import axios from "axios";
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

function AdminEmployees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "",
    salary: "",
  });
  const [editingId, setEditingId] = useState(null);

  /* ======================
      FETCH
  ====================== */
  const fetchEmployees = async () => {
    try {
<<<<<<< HEAD
      const res = await api.get("/employees");
=======
      const res = await axios.get("http://localhost:5000/api/employees");
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
      setEmployees(res.data); // backend trả về array
    } catch (err) {
      console.error("Lỗi lấy employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  /* ======================
      HANDLE INPUT
  ====================== */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ======================
      CREATE / UPDATE
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE
<<<<<<< HEAD
        await api.put(
          `/employees/${editingId}`,
=======
        await axios.put(
          `http://localhost:5000/api/employees/${editingId}`,
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
          form
        );
      } else {
        // CREATE
<<<<<<< HEAD
        await api.post(
          "/employees",
=======
        await axios.post(
          "http://localhost:5000/api/employees",
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
          form
        );
      }

      setForm({ name: "", phone: "", role: "", salary: "" });
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      console.error("Lỗi submit:", err);
    }
  };

  /* ======================
      EDIT
  ====================== */
  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp.id);
  };

  /* ======================
      DELETE
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá?")) return;

    try {
<<<<<<< HEAD
      await api.delete(`/employees/${id}`);
=======
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
      fetchEmployees();
    } catch (err) {
      console.error("Lỗi xoá:", err);
    }
  };

  return (
<<<<<<< HEAD
    <div className="space-y-5">
      <div className="panel-shell">
        <h2 className="text-2xl font-semibold text-slate-800">Quản lý nhân viên</h2>
        <p className="mt-1 text-sm text-slate-500">Thêm mới, cập nhật hoặc xóa thông tin nhân sự.</p>
      </div>

      <div className="panel-shell">
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div>
=======
    <div className="container mt-4">
      <h2>Quản lý nhân viên</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col">
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            <input
              type="text"
              name="name"
              placeholder="Tên"
<<<<<<< HEAD
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
=======
              className="form-control"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

<<<<<<< HEAD
          <div>
=======
          <div className="col">
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            <input
              type="text"
              name="phone"
              placeholder="SĐT"
<<<<<<< HEAD
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
=======
              className="form-control"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

<<<<<<< HEAD
          <div>
=======
          <div className="col">
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            <input
              type="text"
              name="role"
              placeholder="Vai trò (VD: chăm sóc cây)"
<<<<<<< HEAD
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
=======
              className="form-control"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              value={form.role}
              onChange={handleChange}
              required
            />
          </div>

<<<<<<< HEAD
          <div>
=======
          <div className="col">
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            <input
              type="number"
              name="salary"
              placeholder="Lương"
<<<<<<< HEAD
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
=======
              className="form-control"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
              value={form.salary}
              onChange={handleChange}
              required
            />
          </div>

<<<<<<< HEAD
          <div>
            <button className="w-full rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700">
              {editingId ? "Cập nhật" : "Thêm"}
            </button>
          </div>
      </form>
      </div>

      <div className="table-wrap">
      <table className="w-full">
        <thead className="bg-slate-100 text-slate-700">
          <tr>
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Tên</th>
            <th className="p-3 text-left">SĐT</th>
            <th className="p-3 text-left">Vai trò</th>
            <th className="p-3 text-left">Lương</th>
            <th className="p-3 text-left">Hành động</th>
=======
          <div className="col">
            <button className="btn btn-primary w-100">
              {editingId ? "Cập nhật" : "Thêm"}
            </button>
          </div>
        </div>
      </form>

      {/* TABLE */}
      <table className="table table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>SĐT</th>
            <th>Vai trò</th>
            <th>Lương</th>
            <th>Hành động</th>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
<<<<<<< HEAD
            <tr key={emp.id} className="border-t border-slate-100 text-sm">
              <td className="p-3 font-medium text-slate-600">#{emp.id}</td>
              <td className="p-3 text-slate-800">{emp.name}</td>
              <td className="p-3 text-slate-600">{emp.phone}</td>
              <td className="p-3 text-slate-600">{emp.role}</td>
              <td className="p-3 text-slate-700">{Number(emp.salary).toLocaleString("vi-VN")} đ</td>

              <td className="p-3 space-x-2 whitespace-nowrap">
                <button
                  className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-amber-300"
=======
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.phone}</td>
              <td>{emp.role}</td>
              <td>{emp.salary}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
                  onClick={() => handleEdit(emp)}
                >
                  Sửa
                </button>

                <button
<<<<<<< HEAD
                  className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-600"
=======
                  className="btn btn-danger btn-sm"
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
                  onClick={() => handleDelete(emp.id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
<<<<<<< HEAD
          {employees.length === 0 && (
            <tr>
              <td colSpan="6" className="p-8 text-center text-slate-500">
                Chưa có nhân viên nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
=======
        </tbody>
      </table>
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    </div>
  );
}

export default AdminEmployees;