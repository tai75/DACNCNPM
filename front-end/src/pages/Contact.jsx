import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

function Contact() {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-700 text-white py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Liên hệ với chúng tôi
        </h1>
        <p className="opacity-90">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn chăm sóc khu vườn tốt nhất 🌱
        </p>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        
        {/* FORM */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-6 text-green-700">
            Gửi liên hệ
          </h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full border p-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
            />

            <input
              type="tel"
              placeholder="Số điện thoại"
              className="w-full border p-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
            />

            <textarea
              placeholder="Nội dung"
              rows="4"
              className="w-full border p-3 rounded focus:ring-2 focus:ring-green-400 outline-none"
            ></textarea>

            <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
              Gửi liên hệ
            </button>
          </form>
        </div>

        {/* INFO */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
            <FaMapMarkerAlt className="text-green-600 text-xl" />
            <div>
              <p className="font-semibold">Địa chỉ</p>
              <p className="text-gray-600 text-sm">
                Tam Kỳ, Quảng Nam
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
            <FaPhoneAlt className="text-green-600 text-xl" />
            <div>
              <p className="font-semibold">Hotline</p>
              <p className="text-gray-600 text-sm">
                0123 456 789
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
            <FaEnvelope className="text-green-600 text-xl" />
            <div>
              <p className="font-semibold">Email</p>
              <p className="text-gray-600 text-sm">
                gardencare@gmail.com
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* MAP */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-center mb-6">
          Vị trí của chúng tôi
        </h2>

        <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg">
          <iframe
            title="map"
            src="https://www.google.com/maps?q=Tam%20Ky%20Quang%20Nam&output=embed"
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>
      </div>

    </div>
  );
}

export default Contact;