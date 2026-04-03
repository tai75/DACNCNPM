import { useEffect, useState } from "react";
import api from "../../config/axios";

function StaffBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Load bookings error:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      console.error("Update booking status error:", err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Lịch đặt cần xử lý</h1>

      <div className="table-wrap">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Khách hàng</th>
            <th className="p-2">Dịch vụ</th>
            <th className="p-2">Ngày</th>
            <th className="p-2">Khung giờ</th>
            <th className="p-2">Trạng thái</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} className="text-center border-t">
              <td className="p-2">{b.id}</td>
              <td className="p-2">{b.user_name}</td>
              <td className="p-2">{b.service_name}</td>
              <td className="p-2">{new Date(b.booking_date).toLocaleDateString("vi-VN")}</td>
              <td className="p-2">{b.time_slot}</td>
              <td className="p-2">
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b.id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </td>
            </tr>
          ))}
          {bookings.length === 0 && (
            <tr>
              <td colSpan="6" className="p-8 text-center text-gray-500">
                Chưa có booking cần xử lý.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default StaffBookings;
