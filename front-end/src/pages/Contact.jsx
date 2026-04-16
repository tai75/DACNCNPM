import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState } from "react";
import api from "../config/axios";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    try {
      setSubmitting(true);
      setSubmitMessage("");
      setSubmitError("");

      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      };

      const res = await api.post("/contacts", payload);
      if (res.data?.success) {
        setSubmitMessage("Cảm ơn bạn, yêu cầu liên hệ đã được gửi thành công.");
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        return;
      }

      setSubmitError(res.data?.message || "Gửi liên hệ thất bại. Vui lòng thử lại.");
    } catch (error) {
      console.error("Create contact error:", error);
      setSubmitError(error.response?.data?.message || "Không thể gửi liên hệ lúc này.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 px-4 py-20 md:px-6 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-300 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-200 blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl text-center">
          <p className="text-base font-semibold uppercase tracking-widest text-emerald-100">Liên hệ với chúng tôi</p>
          <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-extrabold text-white md:text-5xl">
            Chúng tôi sẵn sàng hỗ trợ bạn
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-emerald-50">
            Gửi thắc mắc hoặc yêu cầu của bạn. Đội ngũ Garden Care sẽ phản hồi sớm nhất có thể.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column - Info Cards */}
          <div className="space-y-6">
            <div>
              <h2 className="mb-8 text-3xl font-bold text-slate-800">Thông tin liên hệ</h2>
              <p className="text-slate-600">Liên hệ với chúng tôi bằng bất kỳ cách nào dưới đây. Chúng tôi luôn sẵn sàng giúp bạn.</p>
            </div>

            <div className="space-y-4">
              {/* Location Card */}
              <div className="group rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-emerald-400">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-3 group-hover:bg-emerald-200 transition">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Địa chỉ</h3>
                    <p className="mt-1 text-sm text-slate-600">40 Trần Hưng Đạo, Tam Kỳ, Quảng Nam, Việt Nam</p>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="group rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-emerald-400">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-3 group-hover:bg-emerald-200 transition">
                    <Phone className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Hotline</h3>
                    <p className="mt-1 text-sm text-slate-600">0123 456 789</p>
                    <p className="text-xs text-slate-500 mt-2">Thứ 2 - Chủ nhật: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="group rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-emerald-400">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-3 group-hover:bg-emerald-200 transition">
                    <Mail className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Email</h3>
                    <p className="mt-1 text-sm text-slate-600">gardencare@gmail.com</p>
                    <p className="text-xs text-slate-500 mt-2">Phản hồi trong 24 giờ</p>
                  </div>
                </div>
              </div>

              {/* Hours Card */}
              <div className="group rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:border-emerald-400">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-emerald-100 p-3 group-hover:bg-emerald-200 transition">
                    <Clock className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Giờ hoạt động</h3>
                    <div className="mt-1 space-y-1 text-sm text-slate-600">
                      <p>Thứ 2 - Thứ 6: 8:00 AM - 6:00 PM</p>
                      <p>Thứ 7 - Chủ nhật: 9:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div>
            <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-lg">
              <h2 className="mb-6 text-2xl font-bold text-slate-800">Gửi liên hệ</h2>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="0123 456 789"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Chủ đề</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
                  >
                    <option value="">-- Chọn chủ đề --</option>
                    <option value="Tư vấn dịch vụ">Tư vấn dịch vụ</option>
                    <option value="Đặt lịch hẹn">Đặt lịch hẹn</option>
                    <option value="Phản hồi và góp ý">Phản hồi & góp ý</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Nội dung</label>
                  <textarea
                    name="message"
                    placeholder="Hãy cho chúng tôi biết chi tiết về vấn đề của bạn..."
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-400 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 resize-none"
                    required
                  ></textarea>
                </div>

                {submitMessage && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {submitMessage}
                  </div>
                )}

                {submitError && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Đang gửi..." : "Gửi liên hệ"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="mb-6 text-3xl font-bold text-slate-800">Vị trí của chúng tôi</h2>
          <div className="overflow-hidden rounded-2xl shadow-lg border border-slate-200">
            <iframe
              title="Garden Care Location"
              src="https://www.google.com/maps?q=Tam%20Ky%20Quang%20Nam&output=embed"
              className="h-96 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;