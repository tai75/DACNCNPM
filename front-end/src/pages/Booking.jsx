import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();

  const serviceData = location.state || {};

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    datetime: "",
  });

  const summary = useMemo(
    () => ({
      id: serviceData.id || 1,
      service: serviceData.service || "Chăm cây bài bản theo gói chuyên sâu",
      price: serviceData.price || 790000,
      note: "Kỹ thuật viên xác nhận chi tiết trước khi đến tận nơi.",
    }),
    [serviceData.id, serviceData.price, serviceData.service]
  );

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("Vui lòng đăng nhập!");
      navigate("/login");
      return;
    }

    navigate("/payment", {
      state: {
        service_id: summary.id,
        booking_date: formData.datetime,
        time_slot: "custom",
        address: formData.address,
        service: summary.service,
        price: summary.price,
        fullName: formData.fullName,
        phone: formData.phone,
      },
    });
  };

  return (
    <div className="w-full py-8 md:py-10">
      <div className="grid gap-8 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="card-soft grid gap-5 p-6 md:p-8 lg:col-span-2">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Bước 1</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800">Đặt lịch chăm sóc</h1>
            <p className="mt-2 text-sm text-slate-500">Điền thông tin để xác nhận lịch hẹn với kỹ thuật viên.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Họ tên</label>
            <input
              type="text"
              name="fullName"
              placeholder="Nhập họ tên của bạn"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Số điện thoại</label>
            <input
              type="tel"
              name="phone"
              placeholder="Ví dụ: 09xxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Địa chỉ</label>
            <input
              type="text"
              name="address"
              placeholder="Số nhà, đường, quận/huyện"
              value={formData.address}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Thời gian thực hiện</label>
            <input
              type="datetime-local"
              name="datetime"
              value={formData.datetime}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              required
            />
          </div>

          <button className="rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700">
            Tiếp tục tới thanh toán
          </button>
        </form>

        <aside className="card-soft h-fit p-6 md:p-7 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Tóm tắt dịch vụ</p>
          <h2 className="mt-2 text-xl font-bold text-slate-800">{summary.service}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">{summary.note}</p>

          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Mã dịch vụ</span>
              <span className="font-semibold text-slate-800">#{summary.id}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-600">
              <span>Tạm tính</span>
              <span className="text-lg font-extrabold text-emerald-700">
                {Number(summary.price).toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Lịch hẹn sẽ được xác nhận qua điện thoại sau khi bạn hoàn tất bước thanh toán.
          </p>
        </aside>
      </div>
    </div>
  );
}

export default Booking;