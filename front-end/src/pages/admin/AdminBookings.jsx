import { useEffect, useState } from "react";
import axios from "axios";

function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  // ================= LOAD DATA =================
  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/bookings");
      setBookings(res.data.data || res.data);
    } catch (err) {
      console.error("Lỗi load bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa đơn này?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error("Lỗi xóa:", err);
    }
  };

  // ================= UPDATE STATUS =================
  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${id}`, {
        status,
      });
      fetchBookings();
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Khách hàng</th>
            <th className="p-2">Dịch vụ</th>
            <th className="p-2">Ngày</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="text-center border-t">
              <td className="p-2">{b.id}</td>
              <td className="p-2">{b.user_name}</td>
              <td className="p-2">{b.service_name}</td>
              <td className="p-2">{b.date}</td>

              {/* STATUS */}
              <td className="p-2">
                <select
                  value={b.status}
                  onChange={(e) =>
                    handleStatusChange(b.id, e.target.value)
                  }
                  className="border p-1"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="done">Hoàn thành</option>
                  <option value="cancel">Đã hủy</option>
                </select>
              </td>

              {/* ACTION */}
              <td className="p-2">
                <button
                  onClick={() => handleDelete(b.id)}
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
  );
}

export default AdminBookings;