import { useEffect, useState } from "react";
import api from "../../config/axios";

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
      const res = await api.get("/employees");
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
        await api.put(
          `/employees/${editingId}`,
          form
        );
      } else {
        // CREATE
        await api.post(
          "/employees",
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
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Lỗi xoá:", err);
    }
  };

  return (
    <div className="space-y-5">
      <div className="panel-shell">
        <h2 className="text-2xl font-semibold text-slate-800">Quản lý nhân viên</h2>
        <p className="mt-1 text-sm text-slate-500">Thêm mới, cập nhật hoặc xóa thông tin nhân sự.</p>
      </div>

      <div className="panel-shell">
      <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Tên"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="phone"
              placeholder="SĐT"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="role"
              placeholder="Vai trò (VD: chăm sóc cây)"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={form.role}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="number"
              name="salary"
              placeholder="Lương"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
              value={form.salary}
              onChange={handleChange}
              required
            />
          </div>

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
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id} className="border-t border-slate-100 text-sm">
              <td className="p-3 font-medium text-slate-600">#{emp.id}</td>
              <td className="p-3 text-slate-800">{emp.name}</td>
              <td className="p-3 text-slate-600">{emp.phone}</td>
              <td className="p-3 text-slate-600">{emp.role}</td>
              <td className="p-3 text-slate-700">{Number(emp.salary).toLocaleString("vi-VN")} đ</td>

              <td className="p-3 space-x-2 whitespace-nowrap">
                <button
                  className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-amber-300"
                  onClick={() => handleEdit(emp)}
                >
                  Sửa
                </button>

                <button
                  className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-600"
                  onClick={() => handleDelete(emp.id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
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
    </div>
  );
}

export default AdminEmployees;