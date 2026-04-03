import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../config/axios";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);

  useEffect(() => {
    api
      .get(`/services/${id}`)
      .then((res) => setService(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!service) {
    return (
      <div className="flex min-h-[45vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  const imageBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 md:grid-cols-5 md:px-6 md:py-10">
      <div className="card-soft md:col-span-3">
        <img
          src={service.image ? `${imageBaseUrl}/uploads/${service.image}` : "https://via.placeholder.com/800x400?text=No+Image"}
          alt={service.name}
          className="h-80 w-full rounded-t-2xl object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold text-slate-800">{service.name}</h1>
          <p className="mt-4 leading-7 text-slate-600">{service.description}</p>
        </div>
      </div>

      <aside className="card-soft h-fit p-6 md:col-span-2">
        <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Báo giá</p>
        <p className="mt-2 text-3xl font-extrabold text-emerald-700">
          {Number(service.price || 0).toLocaleString("vi-VN")} đ
        </p>
        <p className="mt-3 text-sm text-slate-500">Giá đã bao gồm công chăm sóc cơ bản cho một lần thực hiện.</p>

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
          className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          Đặt dịch vụ này
        </button>
      </aside>
    </div>
  );
}

export default ServiceDetail;