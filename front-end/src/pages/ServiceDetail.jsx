import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/services/${id}`)
      .then(res => res.json())
      .then(data => setService(data))
      .catch(err => console.log(err));
  }, [id]);

  if (!service) return <p className="text-center mt-10">Đang tải...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <img
        src={service.image}
        alt={service.name}
        className="w-full h-72 object-cover rounded-xl mb-6"
      />

      <h1 className="text-3xl font-bold mb-4">
        {service.name}
      </h1>

      <p className="text-gray-600 mb-4">
        {service.description}
      </p>

      <p className="text-green-600 font-bold text-xl mb-6">
        {service.price.toLocaleString()}đ
      </p>

      <button
        onClick={() =>
          navigate("/booking", {
            state: {
              service: service.name,
              price: service.price,
            },
          })
        }
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Đặt dịch vụ
      </button>
    </div>
  );
}

export default ServiceDetail;