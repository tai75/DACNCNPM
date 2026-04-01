import { useEffect, useState } from "react";
import axios from "axios";

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
      const res = await axios.get("http://localhost:5000/api/employees");
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
        await axios.put(
          `http://localhost:5000/api/employees/${editingId}`,
          form
        );
      } else {
        // CREATE
        await axios.post(
          "http://localhost:5000/api/employees",
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
      await axios.delete(`http://localhost:5000/api/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("Lỗi xoá:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Quản lý nhân viên</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col">
            <input
              type="text"
              name="name"
              placeholder="Tên"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col">
            <input
              type="text"
              name="phone"
              placeholder="SĐT"
              className="form-control"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col">
            <input
              type="text"
              name="role"
              placeholder="Vai trò (VD: chăm sóc cây)"
              className="form-control"
              value={form.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col">
            <input
              type="number"
              name="salary"
              placeholder="Lương"
              className="form-control"
              value={form.salary}
              onChange={handleChange}
              required
            />
          </div>

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
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.phone}</td>
              <td>{emp.role}</td>
              <td>{emp.salary}</td>

              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(emp)}
                >
                  Sửa
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(emp.id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEmployees;