import { useEffect, useState } from "react";
import axios from "axios";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });

  // ======================
  // LOAD DATA
  // ======================
  const fetchServices = async () => {
    const res = await axios.get("http://localhost:5000/api/admin/services");
    setServices(res.data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ======================
  // HANDLE INPUT
  // ======================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ======================
  // ADD / UPDATE
  // ======================
  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/admin/services/${editingId}`,
          form
        );
        alert("Cập nhật thành công");
      } else {
        await axios.post(
          "http://localhost:5000/api/admin/services",
          form
        );
        alert("Thêm dịch vụ thành công");
      }

      setForm({ name: "", description: "", price: "", image: "" });
      setEditingId(null);
      setShowModal(false);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Lỗi!");
    }
  };

  // ======================
  // EDIT
  // ======================
  const handleEdit = (service) => {
    setForm(service);
    setEditingId(service.id);
    setShowModal(true);
  };

  // ======================
  // DELETE
  // ======================
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    await axios.delete(
      `http://localhost:5000/api/admin/services/${id}`
    );

    fetchServices();
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý dịch vụ</h1>

        <button
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Thêm dịch vụ
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th>Ảnh</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="text-center border-t">
                <td>{s.id}</td>

                <td>
                  <img
                    src={s.image}
                    alt=""
                    className="w-16 h-16 object-cover mx-auto"
                  />
                </td>

                <td>{s.name}</td>
                <td>{s.description}</td>
                <td>{s.price}đ</td>

                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Sửa
                  </button>

                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Sửa dịch vụ" : "Thêm dịch vụ"}
            </h2>

            <input
              name="name"
              placeholder="Tên dịch vụ"
              value={form.name}
              onChange={handleChange}
              className="w-full mb-2 p-2 border"
            />

            <input
              name="description"
              placeholder="Mô tả"
              value={form.description}
              onChange={handleChange}
              className="w-full mb-2 p-2 border"
            />

            <input
              name="price"
              placeholder="Giá"
              value={form.price}
              onChange={handleChange}
              className="w-full mb-2 p-2 border"
            />

            <input
              name="image"
              placeholder="Link ảnh"
              value={form.image}
              onChange={handleChange}
              className="w-full mb-4 p-2 border"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded"
              >
                Hủy
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                {editingId ? "Cập nhật" : "Thêm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServices;