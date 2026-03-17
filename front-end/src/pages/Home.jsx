import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const services = [
    { name: "Cắt tỉa cây", img: "/images/service-pruning.jpg" },
    { name: "Bón phân định kỳ", img: "/images/service-fertilizing.jpg" },
    { name: "Phun thuốc sâu", img: "/images/service-spraying.jpg" },
    { name: "Tưới cây tự động", img: "/images/service-watering.jpg" },
    { name: "Thiết kế sân vườn", img: "/images/service-landscape.jpg" },
    { name: "Chăm sóc cây cảnh", img: "/images/service-indoor.jpg" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <div className="flex-grow space-y-20 p-6">

        {/* HERO */}
        <section className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/images/hero-garden.jpg"
            alt="Garden"
            className="absolute w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-green-500/40"></div>

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🌿 Dịch vụ chăm sóc cây chuyên nghiệp
            </h1>
            <p className="text-lg mb-6">
              Đặt lịch nhanh chóng - Nhân viên tận nơi - Giá minh bạch
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/services")}
                className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-semibold shadow"
              >
                Xem dịch vụ
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition"
              >
                Liên hệ
              </button>
            </div>
          </div>
        </section>

        {/* WHY */}
        <section className="text-center">
          <h2 className="text-2xl font-bold mb-10">
            🌟 Tại sao chọn chúng tôi?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Giá minh bạch", icon: "💰" },
              { title: "Nhân viên chuyên nghiệp", icon: "👨‍🌾" },
              { title: "Dịch vụ đa dạng", icon: "🌳" },
              { title: "Hỗ trợ 24/7", icon: "📞" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Cam kết mang đến dịch vụ tốt nhất
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-10">
            🌱 Dịch vụ nổi bật
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group"
              >
                <img
                  src={service.img}
                  alt={service.name}
                  className="h-40 w-full object-cover group-hover:scale-105 transition"
                />

                <div className="p-5">
                  <h3 className="text-lg font-semibold">{service.name}</h3>
                  <p className="text-gray-500 text-sm mt-2">
                    Dịch vụ chuyên nghiệp, đảm bảo hiệu quả cao
                  </p>

                  <button
                    onClick={() => navigate("/booking")}
                    className="mt-4 text-green-600 font-semibold hover:underline"
                  >
                    Đặt lịch →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIAL */}
        <section className="bg-gray-100 py-12 rounded-2xl text-center">
          <h2 className="text-xl font-bold mb-8">
            💬 Khách hàng nói gì?
          </h2>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                name: "Anh Minh",
                content: "Dịch vụ rất nhanh, đặt hôm trước hôm sau có người tới!",
              },
              {
                name: "Chị Lan",
                content: "Nhân viên rất nhiệt tình, tư vấn kỹ lưỡng.",
              },
              {
                name: "Anh Tuấn",
                content: "Giá hợp lý, cây sau khi chăm sóc nhìn đẹp hẳn.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow w-64">
                <div className="text-yellow-400 mb-2">⭐⭐⭐⭐⭐</div>
                <p className="text-sm text-gray-600">{item.content}</p>
                <h4 className="mt-3 font-semibold">{item.name}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12 rounded-2xl text-center shadow">
          <h2 className="text-xl font-bold mb-4">
            📅 Đặt lịch chăm sóc cây ngay hôm nay
          </h2>

          <div className="flex justify-center gap-2">
            <input
              className="px-4 py-2 rounded-full text-black w-64 outline-none"
              placeholder="Nhập số điện thoại..."
            />
            <button
              onClick={() => navigate("/booking")}
              className="bg-white text-green-600 px-4 py-2 rounded-full font-semibold"
            >
              Đặt lịch
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}

export default Home;