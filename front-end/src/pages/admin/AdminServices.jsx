import { useEffect, useState } from "react";
import api from "../../config/axios";
import { Plus, SquarePen, Trash2, ImagePlus, UploadCloud, Sparkles, Eye, Tag } from "lucide-react";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewService, setViewService] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [form, setForm] = useState({ name: "", description: "", price: "", image: null });
  const imageBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const inputClassName =
    "w-full rounded-lg border border-gray-300 p-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100";

  const totalItems = services.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedServices = services.slice(startIndex, startIndex + itemsPerPage);
  const fromItem = totalItems === 0 ? 0 : startIndex + 1;
  const toItem = totalItems === 0 ? 0 : endIndex;

  const pageStart = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const pageEnd = Math.min(totalPages, pageStart + 2);
  const visiblePages = Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => pageStart + index);

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

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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

  const openCreateModal = () => {
    setShowModal(true);
    setEditingId(null);
    setPreview(null);
    setForm({ name: "", description: "", price: "", image: null });
  };

  const openViewModal = (service) => {
    setViewService(service);
  };

  return (
    <div className="space-y-5 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Quản lý dịch vụ</h1>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Thêm dịch vụ
        </button>
      </div>

      {services.length === 0 ? (
        <div className="card-soft flex min-h-[380px] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Chưa có dịch vụ nào</h2>
          <p className="max-w-md text-sm text-slate-500">
            Bắt đầu xây dựng danh mục dịch vụ để khách hàng có thể đặt lịch nhanh hơn và quản lý nội dung thuận tiện hơn.
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-[#059669] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            Thêm dịch vụ đầu tiên
          </button>
        </div>
      ) : (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="p-4 text-left">Hình ảnh</th>
              <th className="p-4 text-left">Tên dịch vụ</th>
              <th className="p-4 text-left">Giá</th>
              <th className="p-4 text-left">Mô tả</th>
              <th className="p-4 text-left">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 text-sm hover:bg-slate-50/70">
                <td className="p-4">
                  <img
                    src={
                      s.image
                        ? `${imageBaseUrl}/uploads/${s.image}`
                        : "/images/hero-garden.webp"
                    }
                    alt=""
                    className="h-14 w-24 rounded-lg border border-slate-200 object-cover"
                  />
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-500">Mã dịch vụ: #{s.id}</p>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <Tag className="h-3.5 w-3.5" />
                    {Number(s.price).toLocaleString("vi-VN")} đ
                  </span>
                </td>
                <td className="max-w-[340px] p-4 text-slate-600">
                  <p className="line-clamp-2">{s.description}</p>
                </td>
                <td className="whitespace-nowrap p-4">
                  <div className="flex items-center gap-2">
                  <button
                    title="Xem dịch vụ"
                    onClick={() => openViewModal(s)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 transition hover:bg-cyan-100"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    title="Sửa dịch vụ"
                    onClick={() => handleEdit(s)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition hover:bg-amber-100"
                  >
                    <SquarePen className="h-4 w-4" />
                  </button>
                  <button
                    title="Xóa dịch vụ"
                    onClick={() => handleDelete(s.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginatedServices.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500">
                  Không có dữ liệu dịch vụ.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
      )}

      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4">
          <div className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl md:p-8">
            <h2 className="mb-6 text-2xl font-semibold text-slate-800">
              {editingId ? "Sửa dịch vụ" : "Thêm dịch vụ"}
            </h2>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Tên dịch vụ</label>
                <input
                  name="name"
                  autoComplete="off"
                  placeholder="Ví dụ: Cắt tỉa cây cảnh"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="xl:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Mô tả</label>
                <textarea
                  name="description"
                  placeholder="Mô tả ngắn về phạm vi dịch vụ"
                  value={form.description}
                  onChange={handleChange}
                  rows={5}
                  className={`${inputClassName} resize-none`}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Giá</label>
                <input
                  type="number"
                  name="price"
                  autoComplete="off"
                  placeholder="Ví dụ: 500000"
                  value={form.price}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>

              <div className="md:col-span-2 xl:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Hình ảnh dịch vụ</label>
                <input id="service-image-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                <label
                  htmlFor="service-image-input"
                  className="flex h-full min-h-[150px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center transition hover:border-green-500 hover:bg-green-50"
                >
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    {form.image ? <ImagePlus className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
                  </div>
                  <p className="text-sm font-medium text-slate-700">Click để tải ảnh lên hoặc kéo thả tệp vào đây</p>
                  <p className="mt-1 text-xs text-slate-500">PNG, JPG, WEBP tối đa 5MB</p>
                </label>
              </div>

              {preview && (
                <div className="md:col-span-2 xl:col-span-1">
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">Xem trước</label>
                  <img
                    src={preview}
                    alt="preview"
                    className="h-[150px] w-full rounded-xl object-cover"
                  />
                </div>
              )}
            </div>

            <div className="mt-7 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-gray-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-lg bg-green-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-green-700"
              >
                {editingId ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewService && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Service detail</p>
                <h3 className="text-2xl font-semibold text-slate-800">{viewService.name}</h3>
              </div>
              <button
                onClick={() => setViewService(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-[220px_1fr]">
              <img
                src={
                  viewService.image
                    ? `${imageBaseUrl}/uploads/${viewService.image}`
                    : "/images/hero-garden.webp"
                }
                alt={viewService.name}
                className="h-40 w-full rounded-xl border border-slate-200 object-cover"
              />

              <div className="space-y-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Giá</p>
                  <p className="text-lg font-semibold text-emerald-700">{Number(viewService.price).toLocaleString("vi-VN")} đ</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Mô tả</p>
                  <p className="text-sm leading-6 text-slate-600">{viewService.description || "Chưa có mô tả"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServices;