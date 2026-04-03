import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const services = [
    { name: "Cắt tỉa cây", img: "/images/service-pruning.jpg" },
    { name: "Bón phân định kỳ", img: "/images/service-fertilizing.jpg" },
    { name: "Phun thuốc sâu", img: "/images/service-spraying.jpg" },
    { name: "Tưới cây tự động", img: "/images/service-watering.jpg" },
    { name: "Thiết kế sân vườn", img: "/images/service-landscape.jpg" },
    { name: "Thiết kế cây trong nhà", img: "/images/service-indoor.jpg" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-14 px-4 py-8 md:px-6 md:py-10">
      <section className="relative overflow-hidden rounded-3xl">
        <img
          src="/images/hero-garden.jpg"
          alt="Garden"
          className="h-[430px] w-full object-cover md:h-[520px]"
        />
        <div className="hero-glass absolute inset-0" />
        <div className="reveal-up absolute inset-0 flex flex-col justify-center px-6 text-white md:px-12">
          <p className="mb-3 w-fit rounded-full border border-white/40 px-3 py-1 text-xs uppercase tracking-[0.15em]">
            Dịch vụ tại nhà
          </p>
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight md:text-5xl">
            Chăm cây bài bản, nhà luôn xanh mà bạn không cần tự xoay sở
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-emerald-100 md:text-base">
            Đặt lịch trong vài phút, đội ngũ kỹ thuật tới đúng giờ và báo cáo rõ tình trạng vườn sau mỗi lần chăm sóc.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => navigate("/services")} className="gc-button gc-button-primary">
              Xem dịch vụ
            </button>
            <button onClick={() => navigate("/booking")} className="gc-button gc-button-ghost">
              Đặt lịch ngay
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Giá minh bạch", sub: "Báo giá trước khi làm" },
          { title: "Kỹ thuật viên chuẩn", sub: "Đào tạo định kỳ" },
          { title: "Lịch linh hoạt", sub: "Sáng, chiều, tối" },
          { title: "Hỗ trợ 24/7", sub: "Tư vấn nhanh mọi lúc" },
        ].map((item) => (
          <article key={item.title} className="card-soft reveal-up p-5">
            <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.sub}</p>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Nổi bật</p>
            <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">Dịch vụ được đặt nhiều</h2>
          </div>
          <button onClick={() => navigate("/services")} className="text-sm font-semibold text-emerald-700 hover:underline">
            Xem tất cả
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <article key={service.name} className="card-soft reveal-up overflow-hidden" style={{ animationDelay: `${index * 0.08}s` }}>
              <img src={service.img} alt={service.name} className="h-44 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-slate-800">{service.name}</h3>
                <p className="mt-2 text-sm text-slate-500">Quy trình chăm sóc đúng kỹ thuật, phù hợp từng loại cây và môi trường sống.</p>
                <button onClick={() => navigate("/booking")} className="mt-4 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50">
                  Đặt lịch cho dịch vụ này
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card-soft grid gap-4 p-6 md:grid-cols-3 md:p-8">
        {[
          "Đặt lịch xong trong chưa tới 2 phút.",
          "Có nhật ký chăm sóc theo từng buổi.",
          "Hỗ trợ đổi lịch linh hoạt khi cần.",
        ].map((text) => (
          <p key={text} className="text-sm text-slate-600">{text}</p>
        ))}
      </section>

      <section className="card-soft overflow-hidden">
        <div className="grid gap-8 bg-gradient-to-r from-emerald-700 to-emerald-600 p-6 text-white md:grid-cols-2 md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-100">Sẵn sàng bắt đầu</p>
            <h2 className="mt-2 text-2xl font-bold md:text-3xl">Lên lịch buổi chăm sóc đầu tiên hôm nay</h2>
            <p className="mt-3 text-sm text-emerald-50">Chọn dịch vụ, khung giờ và địa chỉ. Mọi chi phí đều hiển thị rõ ràng trước khi xác nhận.</p>
          </div>
          <div className="flex items-center md:justify-end">
            <button onClick={() => navigate("/booking")} className="gc-button rounded-xl bg-white px-5 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100">
              Đi tới trang đặt lịch
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;