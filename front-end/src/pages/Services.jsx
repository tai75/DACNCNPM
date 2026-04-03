import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../config/axios";

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="flex-grow py-12 px-6 animate-fade-in">

        {/* TITLE */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-3 drop-shadow-lg">
            Dịch vụ chăm sóc sân vườn
          </h1>
          <p className="text-lg text-gray-600">
            Giải pháp toàn diện giúp không gian xanh của bạn luôn tươi đẹp 🌿
          </p>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <div
              key={service.id}
              onClick={() => navigate(`/services/${service.id}`)}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* IMAGE */}
              <div className="overflow-hidden">
                <img
                  src={
                    service.image
                      ? `http://localhost:5000/uploads/${service.image}`
                      : "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={service.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                  {service.name}
                </h2>

                <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>

                <div className="flex justify-between items-center">
                  <p className="text-green-600 font-bold text-lg">
                    {service.price?.toLocaleString()}đ
                  </p>

                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Xem chi tiết
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY */}
        {services.length === 0 && (
          <p className="text-center text-gray-400 mt-10">
            Chưa có dịch vụ nào 😢
          </p>
        )}

      </div>
    </div>
  );
}

export default Services;