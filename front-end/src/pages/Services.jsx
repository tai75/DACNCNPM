import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../config/axios";

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const imageBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[45vh] w-full items-center justify-center py-8">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="w-full py-8 md:py-10">
      <div className="mb-10 reveal-up">
        <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Danh mục dịch vụ</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-800 md:text-4xl">Chăm sóc sân vườn theo nhu cầu thực tế</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
          Mỗi gói đều có quy trình rõ ràng, kỹ thuật viên phụ trách và báo cáo sau khi hoàn thành.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <article
            key={service.id}
            onClick={() => navigate(`/services/${service.id}`)}
            className="card-soft card-interactive reveal-up cursor-pointer overflow-hidden"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <img
              src={
                service.image
                  ? `${imageBaseUrl}/uploads/${service.image}`
                  : "/images/hero-garden.webp"
              }
              alt={service.name}
              className="h-48 w-full object-cover"
            />

            <div className="p-5">
              <h2 className="line-clamp-1 text-lg font-semibold text-slate-800">{service.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-500">{service.description}</p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-base font-bold text-emerald-700">
                  {Number(service.price || 0).toLocaleString("vi-VN")} đ
                </p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Xem chi tiết
                </span>
              </div>
            </div>
          </article>
        ))}

        {services.length === 0 && (
          <div className="card-soft sm:col-span-2 lg:col-span-3">
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-12 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-3">
                <img src="/images/empty-archive.png" alt="Không có dịch vụ" className="h-full w-full object-contain" />
              </div>
              <h2 className="text-xl font-semibold text-slate-800">Chưa có dịch vụ nào</h2>
              <p className="max-w-md text-sm text-slate-500">
                Đội ngũ đang cập nhật danh mục dịch vụ mới. Bạn vẫn có thể tạo yêu cầu chăm sóc để được tư vấn gói phù hợp.
              </p>
              <button
                type="button"
                onClick={() => navigate("/booking")}
                className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Đặt lịch ngay
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;