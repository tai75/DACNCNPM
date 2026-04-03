import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

function Contact() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.14em] text-emerald-700">Liên hệ</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-800">Chúng tôi sẵn sàng hỗ trợ bạn</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="card-soft p-6 md:p-8">
          <h2 className="mb-6 text-xl font-semibold text-emerald-700">
            Gửi liên hệ
          </h2>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <input
              type="tel"
              placeholder="Số điện thoại"
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            />

            <textarea
              placeholder="Nội dung"
              rows="4"
              className="w-full rounded-xl border border-slate-200 p-3 outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            ></textarea>

            <button className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700">
              Gửi liên hệ
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="card-soft flex items-center gap-4 p-6">
            <FaMapMarkerAlt className="text-green-600 text-xl" />
            <div>
              <p className="font-semibold">Địa chỉ</p>
              <p className="text-gray-600 text-sm">
                Tam Kỳ, Quảng Nam
              </p>
            </div>
          </div>

          <div className="card-soft flex items-center gap-4 p-6">
            <FaPhoneAlt className="text-green-600 text-xl" />
            <div>
              <p className="font-semibold">Hotline</p>
              <p className="text-gray-600 text-sm">
                0123 456 789
              </p>
            </div>
          </div>

          <div className="card-soft flex items-center gap-4 p-6">
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

      <div className="mt-8">
        <h2 className="mb-4 text-2xl font-bold text-slate-800">
          Vị trí của chúng tôi
        </h2>

        <div className="card-soft h-[360px] overflow-hidden">
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