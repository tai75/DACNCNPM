import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceData = location.state;

  const [services, setServices] = useState([]);

  const [formData, setFormData] = useState({
    service_id: "",
    booking_date: "",
    time_slot: "",
    address: "",
  });

  // 🔥 Load services từ DB
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/services")
      .then((res) => setServices(res.data))
      .catch((err) => console.log(err));
  }, []);

  // 🔥 Auto fill nếu đi từ Services
  useEffect(() => {
    if (serviceData) {
      setFormData((prev) => ({
        ...prev,
        service_id: serviceData.id || "",
      }));
    }
  }, [serviceData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    const bookingData = {
      user_id: user.id,
      service_id: formData.service_id,
      booking_date: formData.booking_date,
      time_slot: formData.time_slot,
      address: formData.address,
    };

    try {
      // Không tạo booking ở đây nữa, chuyển đến Payment để chọn phương thức thanh toán
      const selectedServiceInfo = services.find(s => s.id == formData.service_id);

      const bookingData = {
        service_id: parseInt(formData.service_id),
        booking_date: formData.booking_date,
        time_slot: formData.time_slot,
        address: formData.address,
        service: selectedServiceInfo?.name || 'Dịch vụ',
        price: selectedServiceInfo?.price || 0
      };

      navigate("/payment", {
        state: bookingData
      });
    } catch (err) {
      console.log(err);
      alert("Có lỗi xảy ra!");
    }
  };

  // 👉 lấy thông tin service đang chọn
  const selectedService = services.find(
    (s) => s.id == formData.service_id
  );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-3xl">

        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
          📅 Đặt lịch chăm sóc cây
        </h1>

        <form onSubmit={handleSubmit} className="grid gap-5">

          {/* SERVICE */}
          <div>
            <label className="text-sm text-gray-600">Dịch vụ</label>
            <select
              name="service_id"
              value={formData.service_id}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            >
              <option value="">Chọn dịch vụ</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>

            {selectedService && (
              <p className="text-green-600 mt-2 font-semibold">
                Giá: {selectedService.price?.toLocaleString()}đ
              </p>
            )}
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm text-gray-600">Ngày</label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          {/* TIME SLOT */}
          <div>
            <label className="text-sm text-gray-600">Khung giờ</label>
            <select
              name="time_slot"
              value={formData.time_slot}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            >
              <option value="">Chọn khung giờ</option>
              <option value="08:00-10:00">08:00 - 10:00</option>
              <option value="10:00-12:00">10:00 - 12:00</option>
              <option value="13:00-15:00">13:00 - 15:00</option>
              <option value="15:00-17:00">15:00 - 17:00</option>
            </select>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="text-sm text-gray-600">Địa chỉ</label>
            <input
              type="text"
              name="address"
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>

          {/* BUTTON */}
          <button className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:opacity-90">
            Xác nhận đặt lịch
          </button>

        </form>
      </div>
    </div>
  );
}

export default Booking;