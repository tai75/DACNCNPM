import { useEffect, useState } from "react";
import axios from "axios";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: null });

  // ===== LOAD DATA =====
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải dữ liệu dịch vụ");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // ===== INPUT & FILE =====
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // ===== SUBMIT =====
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      if (form.image) formData.append("image", form.image); // field name phải đúng với multer

      if (editingId) {
        // Update
        await axios.put(
          `http://localhost:5000/api/admin/services/${editingId}`,
          formData
        );
        alert("Cập nhật thành công");
      } else {
        // Create
        await axios.post(
          "http://localhost:5000/api/admin/services",
          formData
        );
        alert("Thêm dịch vụ thành công");
      }

      // reset form
      setForm({ name: "", description: "", price: "", image: null });
      setPreview(null);
      setEditingId(null);
      setShowModal(false);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Lỗi gửi dữ liệu dịch vụ");
    }
  };

  // ===== EDIT & DELETE =====
  const handleEdit = (service) => {
    setForm({ name: service.name, description: service.description, price: service.price, image: null });
    setPreview(service.image ? `http://localhost:5000/uploads/${service.image}` : null);
    setEditingId(service.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
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
            setPreview(null);
            setForm({ name: "", description: "", price: "", image: null });
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
                    src={
                      s.image
                        ? `http://localhost:5000/uploads/${s.image}`
                        : "https://via.placeholder.com/100?text=No+Image"
                    }
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
              type="number"
              name="price"
              placeholder="Giá"
              value={form.price}
              onChange={handleChange}
              className="w-full mb-2 p-2 border"
            />
            <input type="file" onChange={handleFileChange} className="w-full mb-2" />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-full h-40 object-cover mb-3 rounded"
              />
            )}
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