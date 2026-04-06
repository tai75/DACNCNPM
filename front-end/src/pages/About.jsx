function About() {
  return (
<<<<<<< HEAD
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-8 md:px-6 md:py-10">
      <section className="card-soft grid gap-8 overflow-hidden md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
          alt="garden"
          className="h-full min-h-[280px] w-full object-cover"
        />
        <div className="p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Về chúng tôi</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-800">Garden Care xây dựng chuẩn chăm cây rõ ràng, dễ đặt lịch</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Chúng tôi kết nối khách hàng với đội ngũ chuyên môn để xử lý từ bảo dưỡng định kỳ đến thiết kế lại mảng xanh.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="card-soft p-6">
          <h3 className="text-xl font-semibold text-slate-800">Sứ mệnh</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Giúp mỗi gia đình duy trì không gian sống xanh bền vững bằng dịch vụ chăm sóc bài bản và lịch làm việc có thể theo dõi.
          </p>
        </article>
        <article className="card-soft p-6">
          <h3 className="text-xl font-semibold text-slate-800">Tầm nhìn</h3>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Trở thành nền tảng chăm sóc cây hàng đầu tại Việt Nam với trải nghiệm số hóa, minh bạch và thân thiện cho cả khách hàng lẫn kỹ thuật viên.
          </p>
        </article>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-800">Giá trị cốt lõi</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {[
            "Chất lượng ổn định",
            "Lấy khách hàng làm trung tâm",
            "Quy trình minh bạch",
            "Đội ngũ chuyên nghiệp",
            "Đổi mới liên tục",
            "Hỗ trợ tận tâm"
          ].map((item) => (
            <div key={item} className="card-soft p-5 text-sm font-medium text-slate-700">
              {item}
=======
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
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
            </div>
          ))}
        </div>
      </section>
<<<<<<< HEAD
=======

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

>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
    </div>
  );
}

export default About;