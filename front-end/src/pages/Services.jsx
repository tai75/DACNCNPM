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
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
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
            className="card-soft reveal-up cursor-pointer overflow-hidden transition hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.06}s` }}
          >
            <img
              src={
                service.image
                  ? `${imageBaseUrl}/uploads/${service.image}`
                  : "https://via.placeholder.com/300x200?text=No+Image"
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
          <div className="card-soft p-8 text-center text-slate-500 sm:col-span-2 lg:col-span-3">
            Chưa có dịch vụ nào.
          </div>
        )}
      </div>
    </div>
  );
}

export default Services;