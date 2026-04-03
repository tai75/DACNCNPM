import { useEffect, useState } from "react";
import api from "../config/axios";

function Bookings() {
  const [bookings, setBookings] = useState([]);

  const statusClass = (status) => {
    if (status === "completed") return "badge-status bg-green-100 text-green-700";
    if (status === "confirmed") return "badge-status bg-blue-100 text-blue-700";
    if (status === "cancelled") return "badge-status bg-red-100 text-red-700";
    return "badge-status bg-yellow-100 text-yellow-700";
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/bookings");
        setBookings(res.data.data || []);
      } catch (err) {
        console.error("Load my bookings error:", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đặt lịch</h1>

      <div className="table-wrap">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Dịch vụ</th>
              <th className="p-3 text-left">Ngày</th>
              <th className="p-3 text-left">Khung giờ</th>
              <th className="p-3 text-left">Trạng thái</th>
              <th className="p-3 text-left">Thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.service_name}</td>
                <td className="p-3">{new Date(b.booking_date).toLocaleDateString("vi-VN")}</td>
                <td className="p-3">{b.time_slot}</td>
                <td className="p-3">
                  <span className={statusClass(b.status)}>{b.status_vietnamese || b.status}</span>
                </td>
                <td className="p-3">
                  <span className={statusClass(b.payment_status)}>{b.payment_status_vietnamese || b.payment_status}</span>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  Bạn chưa có lịch đặt nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bookings;
