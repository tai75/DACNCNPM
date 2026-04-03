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
        © {new Date().getFullYear()} Garden Care. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;