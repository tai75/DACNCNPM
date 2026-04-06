import { useEffect, useState } from "react";

function Admin() {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });

  const [editingId, setEditingId] = useState(null);

  // GET DATA
  const fetchServices = () => {
    fetch("http://localhost:5000/api/services")
      .then(res => res.json())
      .then(data => setServices(data));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetch(`http://localhost:5000/api/services/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("http://localhost:5000/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ name: "", price: "", description: "", image: "" });
    setEditingId(null);
    fetchServices();
  };

  // DELETE
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/services/${id}`, {
      method: "DELETE",
    });
    fetchServices();
  };

  // EDIT
  const handleEdit = (service) => {
    setForm(service);
    setEditingId(service.id);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        Admin quản lý dịch vụ
      </h1>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 space-y-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tên dịch vụ" className="w-full border p-2" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Giá" className="w-full border p-2" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Tên ảnh (vd: service-pruning.jpg)" className="w-full border p-2" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" className="w-full border p-2"></textarea>

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          {editingId ? "Cập nhật" : "Thêm dịch vụ"}
        </button>
      </form>

      {/* LIST */}
      <div className="grid md:grid-cols-3 gap-4">
        {services.map((s) => (
          <div key={s.id} className="border p-3 rounded shadow">
            <img
              src={`/images/${s.image}`}
              className="h-32 w-full object-cover mb-2"
            />

            <h2 className="font-bold">{s.name}</h2>
            <p>{s.price}đ</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(s)} className="bg-yellow-400 px-2 py-1">
                Sửa
              </button>
              <button onClick={() => handleDelete(s.id)} className="bg-red-500 text-white px-2 py-1">
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;