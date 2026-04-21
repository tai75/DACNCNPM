import { useNavigate } from "react-router-dom";
import { Clock3 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

function Home() {
  const navigate = useNavigate();

  const heroImage = "/images/hero-garden.webp";

  const services = [
    {
      name: "Cắt tỉa cây",
      img: "/images/service-pruning.webp",
      area: "Quận 1, Quận 3, Bình Thạnh",
      price: "500k/lần",
      duration: "1 buổi",
      rating: 4.8,
    },
    {
      name: "Bón phân",
      img: "/images/service-fertilizing.webp",
      area: "Thủ Đức, Quận 2, Quận 9",
      price: "320k/lần",
      duration: "2 buổi",
      rating: 4.7,
    },
    {
      name: "Phun thuốc sâu",
      img: "/images/service-spraying.avif",
      area: "Gò Vấp, Tân Bình, Phú Nhuận",
      price: "450k/lần",
      duration: "1 buổi",
      rating: 4.9,
    },
    {
      name: "Tưới cây",
      img: "/images/service-watering.webp",
      area: "Quận 7, Nhà Bè, Bình Chánh",
      price: "650k/lần",
      duration: "3 buổi",
      rating: 4.6,
    },
    {
      name: "Thiết kế sân vườn",
      img: "/images/service-landscape.webp",
      area: "Toàn TP.HCM",
      price: "1.200k/lần",
      duration: "Theo dự án",
      rating: 5.0,
    },
    {
      name: "Chăm sóc cây trong nhà",
      img: "/images/service-indoor.webp",
      area: "Quận 4, Quận 5, Quận 10",
      price: "280k/lần",
      duration: "1 buổi",
      rating: 4.5,
    },
    {
      name: "Dọn dẹp và vệ sinh sân vườn",
      img: "/images/dondep.avif",
      area: "Toàn TP.HCM",
      price: "400k/lần",
      duration: "1 buổi",
      rating: 4.8,
    },
    {
      name: "Trang trí sân vườn",
      img: "/images/trangtri.jpg",
      area: "Toàn TP.HCM",
      price: "750k/lần",
      duration: "Theo nhu cầu",
      rating: 4.9,
    },
  ];

  const projectImages = [
    "/images/sanvuon.avif",
    "/images/sanvuon2.avif",
    "/images/sanvuon3.avif",
    "/images/sanvuon4.avif",
    "/images/sanvuon5.avif",
    "/images/sanvuon6.jpg",
    "/images/sanvuon7.jpg",
  ];

  const testimonials = [
    {
      id: 1,
      name: "Nguyen Thi Ha",
      avatar: "/images/kh1.avif",
      review:
        "Dịch vụ rất chuyên nghiệp, sân vườn nhà mình thay đổi rõ rệt sau 2 tuần chăm sóc định kỳ.",
    },
    {
      id: 2,
      name: "Tran Quoc Viet",
      avatar: "/images/kh2.avif",
      review:
        "Đội ngũ làm việc đúng giờ, tư vấn nhiệt tình và có hướng dẫn rất cụ thể cho người mới chơi cây.",
    },
    {
      id: 3,
      name: "Le Minh Chau",
      avatar: "/images/kh3.avif",
      review:
        "Mình thích cách các bạn theo dõi tiến độ từng buổi và gửi ảnh báo cáo sau khi hoàn thành.",
    },
    {
      id: 4,
      name: "Pham Gia Linh",
      avatar: "/images/kh4.avif",
      review:
        "Sau khi cải tạo sân vườn, không gian thoáng hơn nhiều và cây cũng phát triển đồng đều hơn trước.",
    },
    {
      id: 5,
      name: "Hoang Anh Thu",
      avatar: "/images/kh5.avif",
      review:
        "Mình đánh giá cao sự chỉn chu của đội ngũ, làm xong còn hướng dẫn cách chăm cây rất dễ hiểu.",
    },
    {
      id: 6,
      name: "Dang Minh Khoa",
      avatar: "/images/kh6.avif",
      review:
        "Lịch làm việc rõ ràng, đến đúng giờ và chất lượng cây cải thiện rõ sau vài buổi đầu tiên.",
    },
  ];

  const avatarFallbacks = [
    "/images/hero1.webp",
    "/images/hero3.webp",
    "/images/hero-garden.webp",
    "/images/background.webp",
  ];

  const handleAvatarError = (event, index) => {
    const fallback = avatarFallbacks[index % avatarFallbacks.length];
    if (event.currentTarget.src.endsWith(fallback)) return;
    event.currentTarget.src = fallback;
  };

  return (
    <div className="w-full space-y-16 py-8 md:space-y-20 md:py-10">
      <section
        className="relative left-1/2 mt-16 flex w-screen -translate-x-1/2 min-h-[85vh] items-center justify-center overflow-visible bg-cover bg-center pb-8"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 z-0 bg-cover bg-center">
          <div className="absolute inset-0 bg-slate-950/45" />
        </div>

        <div className="relative z-10 w-full max-w-6xl px-4 text-center text-white md:px-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Kham pha ve dep vuon nha</p>
          <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-extrabold leading-tight md:text-6xl">
            Kiến tạo không gian xanh của bạn
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-100 md:text-base">
            Lên kế hoạch chăm sóc cây theo nhu cầu thực tế, nhận tư vấn nhanh và đặt lịch chỉ trong vài bước.
          </p>
        </div>

      </section>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Giá minh bạch", sub: "Báo giá trước khi làm" },
          { title: "Kỹ thuật viên chuẩn", sub: "Đào tạo định kỳ" },
          { title: "Lịch linh hoạt", sub: "Sáng, chiều, tối" },
          { title: "Hỗ trợ 24/7", sub: "Tư vấn nhanh mọi lúc" },
        ].map((item) => (
          <article key={item.title} className="card-soft card-interactive reveal-up p-5">
            <h3 className="text-base font-semibold text-slate-800">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-500">{item.sub}</p>
          </article>
        ))}
      </section>

      <section className="pt-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Nổi bật</p>
            <h2 className="text-3xl font-bold text-slate-800">Dịch vụ được đặt nhiều</h2>
          </div>
          <button onClick={() => navigate("/services")} className="text-sm font-semibold text-emerald-700 hover:underline">
            Xem tất cả
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <article
              key={service.name}
              className="reveal-up overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="relative">
                <img
                  src={service.img}
                  alt={service.name}
                  loading="lazy"
                  decoding="async"
                  className="h-52 w-full rounded-t-2xl object-cover"
                />
              </div>

              <div className="space-y-3 bg-white p-5">
                <h3 className="min-h-[56px] text-lg font-semibold leading-7 text-slate-800">{service.name}</h3>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock3 className="h-4 w-4 text-slate-400" />
                  <span>Lịch linh hoạt theo khung giờ</span>
                </div>

                <button
                  onClick={() => navigate("/services")}
                  className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                >
                  Xem nhanh
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <div className="relative min-h-[420px]">
          <img
            src="/images/kinhnghiem1.avif"
            alt="San vuon 1"
            loading="lazy"
            decoding="async"
            className="absolute left-0 top-8 h-64 w-64 rounded-2xl border-4 border-white object-cover shadow-xl md:h-72 md:w-72"
          />
          <img
            src="/images/kinhnghiem2.jpg"
            alt="San vuon 2"
            loading="lazy"
            decoding="async"
            className="absolute left-28 top-0 h-56 w-44 rounded-2xl border-4 border-white object-cover shadow-xl md:left-36 md:h-64 md:w-48"
          />
          <img
            src="/images/kinhnghiem3.avif"
            alt="San vuon 3"
            loading="lazy"
            decoding="async"
            className="absolute left-20 top-44 h-56 w-56 rounded-2xl border-4 border-white object-cover shadow-xl md:left-40 md:top-48 md:h-64 md:w-64"
          />
        </div>

        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Về chúng tôi</p>
          <h2 className="text-3xl font-bold text-slate-800 md:text-4xl">Kinh nghiệm của chúng tôi</h2>
          <p className="text-sm text-slate-600 md:text-base">
            Chúng tôi đồng hành cùng khách hàng trong hành trình biến không gian sống thành một khu vườn cân bằng,
            xanh mát và dễ chăm sóc lâu dài.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <p className="text-2xl font-extrabold text-green-600">15+</p>
              <p className="mt-1 text-sm font-medium text-slate-600">Thợ lành nghề</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <p className="text-2xl font-extrabold text-green-600">200+</p>
              <p className="mt-1 text-sm font-medium text-slate-600">Khu vườn hoàn thiện</p>
            </article>
            <article className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <p className="text-2xl font-extrabold text-green-600">5+</p>
              <p className="mt-1 text-sm font-medium text-slate-600">Năm kinh nghiệm</p>
            </article>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Dự án thực tế</p>
            <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">Không gian xanh đã hoàn thiện</h2>
          </div>
        </div>

        <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
          {projectImages.map((imageUrl, index) => (
            <article key={`${imageUrl}-${index}`} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl">
              <img
                src={imageUrl}
                alt="Du an san vuon"
                loading="lazy"
                decoding="async"
                className="w-full rounded-2xl object-cover transition duration-300 hover:scale-105"
              />
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Đánh giá khách hàng</p>
          <h2 className="text-2xl font-bold text-slate-800 md:text-3xl">Khách hàng nói gì về Garden Care</h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={16}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={item.id}>
              <article className="h-full rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-sm leading-relaxed text-slate-600">"{item.review}"</p>

                <div className="mt-5 flex items-center gap-3">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => handleAvatarError(event, index)}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">Khách hàng thân thiết</p>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
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