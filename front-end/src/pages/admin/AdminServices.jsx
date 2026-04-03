import { useEffect, useState } from "react";
import api from "../../config/axios";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: null });
  const imageBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ===== LOAD DATA =====
  const fetchServices = async () => {
    try {
      const res = await api.get("/admin/services");
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
        await api.put(
          `/admin/services/${editingId}`,
          formData
        );
        alert("Cập nhật thành công");
      } else {
        // Create
        await api.post(
          "/admin/services",
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
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Xóa thất bại");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Quản lý dịch vụ</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setEditingId(null);
            setPreview(null);
            setForm({ name: "", description: "", price: "", image: null });
          }}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          + Thêm dịch vụ
        </button>
      </div>

      <div className="table-wrap">
        <table className="w-full">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Ảnh</th>
              <th className="p-3 text-left">Tên</th>
              <th className="p-3 text-left">Mô tả</th>
              <th className="p-3 text-left">Giá</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t border-slate-100 text-sm">
                <td className="p-3 font-medium text-slate-600">#{s.id}</td>
                <td className="p-3">
                  <img
                    src={
                      s.image
                        ? `${imageBaseUrl}/uploads/${s.image}`
                        : "https://via.placeholder.com/100?text=No+Image"
                    }
                    alt=""
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                </td>
                <td className="p-3 text-slate-800">{s.name}</td>
                <td className="p-3 text-slate-600">{s.description}</td>
                <td className="p-3 text-slate-700">{Number(s.price).toLocaleString("vi-VN")} đ</td>
                <td className="p-3 space-x-2 whitespace-nowrap">
                  <button
                    onClick={() => handleEdit(s)}
                    className="rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-medium text-slate-900 transition hover:bg-amber-300"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="rounded-lg bg-rose-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-600"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  Chưa có dịch vụ nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-semibold text-slate-800">
              {editingId ? "Sửa dịch vụ" : "Thêm dịch vụ"}
            </h2>
            <input
              name="name"
              placeholder="Tên dịch vụ"
              value={form.name}
              onChange={handleChange}
              className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
            <input
              name="description"
              placeholder="Mô tả"
              value={form.description}
              onChange={handleChange}
              className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
            <input
              type="number"
              name="price"
              placeholder="Giá"
              value={form.price}
              onChange={handleChange}
              className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100"
            />
            <input type="file" onChange={handleFileChange} className="mb-2 w-full text-sm text-slate-600" />
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="mb-3 h-40 w-full rounded-xl object-cover"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-sky-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-sky-700"
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