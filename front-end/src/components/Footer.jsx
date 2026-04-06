<<<<<<< HEAD
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { MapPin, Phone, Mail } from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-emerald-900/10 bg-emerald-950 text-emerald-100">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
        <div>
          <h2 className="mb-3 text-2xl font-extrabold">Garden Care</h2>
          <p className="max-w-sm text-sm leading-6 text-emerald-100/80">
            Đồng hành cùng bạn kiến tạo không gian xanh khỏe mạnh, thẩm mỹ và bền vững với quy trình chăm sóc cảnh quan bài bản.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-700/80 bg-emerald-900/40 text-emerald-100 transition hover:border-emerald-400 hover:text-emerald-300">
              <FaFacebookF size={14} />
            </button>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-700/80 bg-emerald-900/40 text-emerald-100 transition hover:border-emerald-400 hover:text-emerald-300">
              <FaInstagram size={15} />
            </button>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-emerald-700/80 bg-emerald-900/40 text-emerald-100 transition hover:border-emerald-400 hover:text-emerald-300">
              <SiZalo size={14} />
            </button>
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">Liên kết nhanh</h3>
          <ul className="space-y-2.5 text-sm">
            <li><NavLink to="/" className="transition hover:text-emerald-300">Trang chủ</NavLink></li>
            <li><NavLink to="/services" className="transition hover:text-emerald-300">Dịch vụ</NavLink></li>
            <li><NavLink to="/services" className="transition hover:text-emerald-300">Bảng giá</NavLink></li>
            <li><NavLink to="/booking" className="transition hover:text-emerald-300">Đặt lịch</NavLink></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-base font-semibold text-white">Thông tin liên hệ</h3>
          <ul className="space-y-3 text-sm text-emerald-100/85">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 text-emerald-300" />
              <span>40 Trần Hưng Đạo, Tam Kỳ, Quảng Nam</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 text-emerald-300" />
              <span>0123 456 789</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-emerald-300" />
              <span>gardencare@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-emerald-800/60 py-4 text-center text-sm text-emerald-100/80">
=======
function Footer() {
  return (
    <footer className="bg-green-700 text-white mt-10">
      <div className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-6">

        {/* Cột 1 */}
        <div>
          <h2 className="text-xl font-bold mb-3">🌿 Garden Care</h2>
          <p className="text-sm opacity-90">
            Dịch vụ chăm sóc cây chuyên nghiệp, mang thiên nhiên đến ngôi nhà bạn.
          </p>
        </div>

        {/* Cột 2 */}
        <div>
          <h3 className="font-semibold mb-3">Liên kết</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">Trang chủ</li>
            <li className="hover:underline cursor-pointer">Dịch vụ</li>
            <li className="hover:underline cursor-pointer">Đặt lịch</li>
            <li className="hover:underline cursor-pointer">Liên hệ</li>
          </ul>
        </div>

        {/* Cột 3 */}
        <div>
          <h3 className="font-semibold mb-3">Liên hệ</h3>
          <p className="text-sm">📍 Đà Nẵng</p>
          <p className="text-sm">📞 0123 456 789</p>
          <p className="text-sm">📧 gardencare@gmail.com</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center text-sm py-4 border-t border-green-600">
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
        © {new Date().getFullYear()} Garden Care. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;