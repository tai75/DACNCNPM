import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/services")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch(() => alert("Lỗi tải dịch vụ"));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow py-12 px-6">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-700 mb-3">
            Dịch vụ chăm sóc sân vườn
          </h1>
          <p className="text-gray-500">
            Giải pháp toàn diện giúp không gian xanh của bạn luôn tươi đẹp 🌿
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition overflow-hidden cursor-pointer"
              onClick={() => navigate(`/services/${service.id}`)}
            >
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-44 object-cover group-hover:scale-105 transition"
              />

              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2">
                  {service.name}
                </h2>

                <p className="text-gray-600 text-sm mb-3">
                  {service.description}
                </p>

                <p className="text-green-600 font-bold text-lg">
                  {service.price?.toLocaleString()}đ
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Services;