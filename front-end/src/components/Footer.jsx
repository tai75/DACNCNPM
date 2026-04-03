import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 border-t border-emerald-900/10 bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <h2 className="mb-3 text-xl font-bold">Garden Care</h2>
          <p className="text-sm leading-6 text-emerald-100/80">
            Nền tảng chăm sóc sân vườn tận nơi với quy trình minh bạch, nhân sự chuyên môn và lịch làm việc rõ ràng.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Khám phá</h3>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/" className="transition hover:text-white">Trang chủ</NavLink></li>
            <li><NavLink to="/services" className="transition hover:text-white">Dịch vụ</NavLink></li>
            <li><NavLink to="/booking" className="transition hover:text-white">Đặt lịch</NavLink></li>
            <li><NavLink to="/bookings" className="transition hover:text-white">Lịch sử đặt lịch</NavLink></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Liên hệ</h3>
          <p className="text-sm">Đà Nẵng</p>
          <p className="text-sm">0123 456 789</p>
          <p className="text-sm">gardencare@gmail.com</p>
        </div>
      </div>

      <div className="border-t border-emerald-800/60 py-4 text-center text-sm text-emerald-100/80">
        © {new Date().getFullYear()} Garden Care. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;