function About() {
  return (
    <div>

      {/* HERO */}
      <section className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Garden Care 🌿
        </h1>
        <p className="text-lg md:text-xl opacity-90">
          Giải pháp chăm sóc cây xanh toàn diện cho không gian sống của bạn
        </p>
      </section>

      {/* GIỚI THIỆU */}
      <section className="max-w-6xl mx-auto py-20 px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-green-700">
            Chúng tôi là ai?
          </h2>

          <p className="text-gray-600 mb-4 leading-relaxed">
            Garden Care là nền tảng giúp bạn dễ dàng đặt lịch chăm sóc cây,
            kết nối nhanh chóng với đội ngũ chuyên gia giàu kinh nghiệm.
          </p>

          <p className="text-gray-600 leading-relaxed">
            Chúng tôi cung cấp các dịch vụ từ cắt tỉa, bón phân đến thiết kế
            sân vườn chuyên nghiệp, mang lại không gian sống xanh và thư giãn.
          </p>

          <button className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-md">
            Tìm hiểu thêm
          </button>
        </div>

        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
          alt="garden"
          className="rounded-2xl shadow-xl hover:scale-105 transition duration-300"
        />
      </section>

      {/* SỨ MỆNH & TẦM NHÌN */}
      <section className="bg-green-50 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
          Sứ mệnh & Tầm nhìn
        </h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 px-4">
          
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">🎯 Sứ mệnh</h3>
            <p className="text-gray-600 leading-relaxed">
              Mang đến không gian xanh, sạch và đẹp cho mọi gia đình thông qua
              các dịch vụ chăm sóc cây chuyên nghiệp và tận tâm.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-4">🌍 Tầm nhìn</h3>
            <p className="text-gray-600 leading-relaxed">
              Trở thành nền tảng chăm sóc cây hàng đầu Việt Nam, kết nối khách
              hàng và chuyên gia một cách nhanh chóng, tiện lợi.
            </p>
          </div>

        </div>
      </section>

      {/* GIÁ TRỊ CỐT LÕI */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
          Giá trị cốt lõi
        </h2>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-4">
          {[
            "Chất lượng dịch vụ",
            "Khách hàng là trung tâm",
            "Đổi mới liên tục",
            "Đội ngũ chuyên nghiệp",
            "Minh bạch giá cả",
            "Hỗ trợ tận tâm"
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-2xl hover:-translate-y-2 transition text-center"
            >
              <p className="font-semibold text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TẠI SAO CHỌN */}
      <section className="bg-green-50 py-20">
        <h2 className="text-3xl font-bold text-center mb-12 text-green-700">
          Tại sao chọn chúng tôi?
        </h2>

        <div className="max-w-3xl mx-auto space-y-6 px-4">
          {[
            "Đặt lịch nhanh chóng chỉ trong vài bước",
            "Nhân viên giàu kinh nghiệm",
            "Giá cả rõ ràng, không phát sinh",
            "Hỗ trợ khách hàng 24/7",
            "Cam kết chất lượng dịch vụ"
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <span className="text-green-600 font-bold text-lg">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-gray-600">{item}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default About;