import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/axios";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await api.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.error("Load service detail error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const serviceImages = useMemo(() => {
    if (!service) return [];
    const imageBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    const cover = service.image
      ? `${imageBaseUrl}/uploads/${service.image}`
      : "/images/hero-garden.webp";

    return [cover, "/images/service-landscape.webp", "/images/service-pruning.webp"];
  }, [service]);

  if (loading) {
    return (
      <div className="flex min-h-[45vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[45vh] w-full items-center justify-center">
        <div className="card-soft w-full max-w-xl p-6 text-center">
          <h1 className="text-xl font-bold text-slate-800">Không tải được chi tiết dịch vụ</h1>
          <p className="mt-2 text-sm text-slate-500">Vui lòng thử lại sau hoặc quay về danh sách dịch vụ.</p>
          <button
            onClick={() => navigate("/services")}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Quay về dịch vụ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid w-full gap-8 py-8 md:grid-cols-2 md:py-10">
      <section className="space-y-4">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={serviceImages[0]}
            alt={service.name}
            className="h-72 w-full object-cover md:h-[420px]"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {serviceImages.slice(1).map((image) => (
            <div key={image} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img src={image} alt={service.name} className="h-40 w-full object-cover" />
            </div>
          ))}
        </div>
      </section>

      <aside className="card-soft h-fit p-6 md:sticky md:top-24">
        <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Chi tiết dịch vụ</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-800">{service.name}</h1>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          <span>{"★".repeat(5)}</span>
          <span>4.8/5</span>
        </div>
        <p className="mt-4 leading-7 text-slate-600">{service.description}</p>

        <p className="mt-6 text-xs uppercase tracking-[0.14em] text-emerald-700">Báo giá</p>
        <p className="mt-2 text-3xl font-extrabold text-emerald-700">
          {Number(service.price || 0).toLocaleString("vi-VN")} đ
        </p>
        <p className="mt-2 text-sm text-slate-500">Giá đã bao gồm công chăm sóc cơ bản cho một lần thực hiện.</p>

        <div className="mt-6">
          <h2 className="text-base font-semibold text-slate-800">Quy trình thực hiện</h2>
          <ul className="mt-3 space-y-2">
            {[
              "Khảo sát nhanh tình trạng cây và khu vực thực hiện.",
              "Triển khai chăm sóc đúng kỹ thuật theo từng loại cây.",
              "Bàn giao kết quả và hướng dẫn chăm sóc tiếp theo.",
            ].map((step, index) => (
              <li key={step} className="flex gap-3 text-sm text-slate-600">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() =>
            navigate("/booking", {
              state: {
                id: service.id,
                service: service.name,
                price: service.price,
              },
            })
          }
          className="mt-8 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-emerald-700 hover:shadow-lg"
        >
          Đặt dịch vụ này
        </button>
      </aside>
    </div>
  );
}

export default ServiceDetail;