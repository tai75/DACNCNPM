import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/axios";
import { Star } from "lucide-react";
import { addServiceToCart } from "../utils/cart";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState("intro");
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const imageBaseUrl = rawApiUrl.replace(/\/+$/, "").replace(/\/api$/, "");

  const getImageUrl = (image) => {
    if (!image) return "/images/hero-garden.webp";
    if (/^https?:\/\//i.test(image)) return image;
    return `${imageBaseUrl}/uploads/${image}`;
  };

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError(false);
        const detailRes = await api.get(`/services/${id}`);
        setService(detailRes.data);
      } catch (err) {
        console.error("Load service detail error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  useEffect(() => {
    if (activeTab === "reviews" && !reviewsLoading && !reviews.length) {
      const fetchReviews = async () => {
        try {
          setReviewsLoading(true);
          const res = await api.get(`/reviews/service/${id}`);
          setReviews(res.data.reviews || []);
          setReviewStats(res.data.stats || null);
        } catch (err) {
          console.error("Load reviews error:", err);
        } finally {
          setReviewsLoading(false);
        }
      };
      fetchReviews();
    }
  }, [activeTab, id, reviews.length, reviewsLoading]);

  const serviceImages = useMemo(() => {
    if (!service) return [];
    const cover = getImageUrl(service.image);

    return [cover];
  }, [service]);

  const basePrice = Number(service?.price || 0);
  const finalPrice = basePrice;

  const handleAddToCart = () => {
    if (!service) return;

    const result = addServiceToCart({
      id: service.id,
      name: service.name,
      price: finalPrice,
      image: service.image,
    });

    if (result.added) {
      alert("Đã thêm dịch vụ vào giỏ hàng.");
      return;
    }

    alert("Dịch vụ này đã có trong giỏ hàng.");
  };

  const includedItems = [
    "Khảo sát hiện trạng trước khi thực hiện",
    "Kỹ thuật viên theo dõi và tư vấn sau dịch vụ",
    "Dọn vệ sinh khu vực sau khi hoàn tất",
    "Hỗ trợ hướng dẫn chăm cây tại nhà 24/7",
  ];

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  const tabItems = [
    { key: "intro", label: "Giới thiệu" },
    { key: "process", label: "Quy trình" },
    { key: "reviews", label: "Đánh giá" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[45vh] w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex min-h-[45vh] w-full items-center justify-center">
        <div className="card-soft w-full max-w-xl p-6 text-center">
          <h1 className="text-xl font-bold text-slate-800">Không tải được chi tiết dịch vụ</h1>
          <p className="mt-2 text-sm text-slate-500">Vui lòng thử lại sau hoặc quay về danh sách dịch vụ.</p>
          <button
            onClick={() => navigate("/services")}
            className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Quay về dịch vụ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-100 py-8 md:py-10">
      <div className="mx-auto max-w-[1180px] px-4 md:px-6">
        <div className="mb-5 text-sm text-slate-500">
          <span className="text-emerald-600">Trang chủ</span>
          <span className="mx-2">/</span>
          <span className="text-emerald-600">Dịch vụ</span>
          <span className="mx-2">/</span>
          <span className="font-semibold text-slate-700">{service.name}</span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[2.4fr_1fr]">
          <section className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <img
                src={serviceImages[0]}
                alt={service.name}
                className="h-[320px] w-full object-cover md:h-[520px]"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <h1 className="text-3xl font-extrabold text-slate-800">{service.name}</h1>
              {reviewStats && reviewStats.total_reviews > 0 ? (
                <p className="mt-2 text-sm text-slate-500">
                  {reviewStats.avg_rating.toFixed(1)} ({reviewStats.total_reviews} đánh giá)
                </p>
              ) : (
                <p className="mt-2 text-sm text-slate-500">0.0 (0 đánh giá)</p>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="text-2xl font-bold text-slate-800">Dịch vụ kèm theo</h2>
              <ul className="mt-4 space-y-2">
                {includedItems.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-600">
                    <span className="mt-2 h-2 w-2 rounded-full bg-cyan-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-2">
              <div className="flex flex-wrap gap-2">
                {tabItems.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      activeTab === tab.key
                        ? "bg-emerald-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
              {activeTab === "intro" && (
                <>
                  <h2 className="text-2xl font-bold text-slate-800">Giới thiệu dịch vụ</h2>
                  <p className="mt-4 leading-8 text-slate-600">{service.description}</p>
                </>
              )}

              {activeTab === "process" && (
                <>
                  <h2 className="text-2xl font-bold text-slate-800">Quy trình thực hiện</h2>
                  <ol className="mt-4 space-y-3">
                    {[
                      "Xác nhận nhu cầu và chốt lịch với khách hàng.",
                      "Kỹ thuật viên đến khảo sát nhanh trước khi triển khai.",
                      "Tiến hành chăm sóc theo checklist kỹ thuật.",
                      "Bàn giao, đánh giá kết quả và tư vấn duy trì.",
                    ].map((step, index) => (
                      <li key={step} className="flex items-start gap-3 text-slate-600">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}

              {activeTab === "reviews" && (
                <>
                  <h2 className="text-2xl font-bold text-slate-800">Đánh giá</h2>
                  {reviewsLoading ? (
                    <div className="mt-4 flex items-center justify-center">
                      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <p className="mt-4 text-slate-600">Chưa có đánh giá nào cho dịch vụ này.</p>
                  ) : (
                    <div className="mt-4 space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-t border-slate-200 pt-4 first:border-t-0 first:pt-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold text-slate-800">{review.user_name}</p>
                              <div className="mt-1">{renderStars(review.rating)}</div>
                            </div>
                            <p className="text-sm text-slate-500">
                              {new Date(review.created_at).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                          {review.comment && (
                            <p className="mt-2 text-slate-600">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 lg:sticky lg:top-24">
              <h3 className="text-3xl font-bold text-slate-800">Đặt lịch ngay</h3>

              <div className="mt-4 rounded-xl bg-slate-100 p-3 text-sm">
                <div className="border-t border-slate-300 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Tổng tiền</span>
                    <span className="text-2xl font-extrabold text-emerald-700">{finalPrice.toLocaleString("vi-VN")} đ</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 font-semibold text-white transition hover:brightness-105"
              >
                Thêm vào giỏ hàng
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <h3 className="text-2xl font-bold text-slate-800">Đánh giá nhanh</h3>
              <p className="mt-1 text-4xl font-extrabold text-slate-800">
                {reviewStats ? reviewStats.avg_rating.toFixed(1) : "0.0"} / 5.0
              </p>
              <div className="mt-2 flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star
                    key={item}
                    className={`h-4 w-4 ${
                      reviewStats && item <= reviewStats.avg_rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {reviewStats ? `${reviewStats.total_reviews} khách đã đánh giá dịch vụ này.` : "0 khách đã đánh giá dịch vụ này."}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;