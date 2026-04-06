function About() {
  return (
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
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default About;