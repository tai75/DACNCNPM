import { useEffect, useMemo, useState } from "react";
import api from "../../config/axios";
import { Eye, EyeOff, Star, Trash2 } from "lucide-react";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [visibilityMap, setVisibilityMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reviews");
      const list = res.data?.data || [];
      setReviews(list);
      setVisibilityMap(
        Object.fromEntries(list.map((item) => [item.id, item.is_visible !== 0]))
      );
    } catch (err) {
      console.error("Lỗi lấy reviews:", err);
      alert("Không thể tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const filtered = reviews.filter((review) => {
      const visible = visibilityMap[review.id] ?? true;
      const matchesKeyword =
        review.customer_name?.toLowerCase().includes(keyword) ||
        review.service_name?.toLowerCase().includes(keyword) ||
        review.comment?.toLowerCase().includes(keyword);
      const matchesRating = ratingFilter === "all" || Number(review.rating) === Number(ratingFilter);
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" && visible) ||
        (visibilityFilter === "hidden" && !visible);

      return matchesKeyword && matchesRating && matchesVisibility;
    });

    const sorted = [...filtered];
    if (sortBy === "latest") {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === "oldest") {
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === "rating_desc") {
      sorted.sort((a, b) => Number(b.rating) - Number(a.rating));
    } else if (sortBy === "rating_asc") {
      sorted.sort((a, b) => Number(a.rating) - Number(b.rating));
    }

    return sorted;
  }, [reviews, search, ratingFilter, visibilityFilter, visibilityMap, sortBy]);

  const totalItems = filteredReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + itemsPerPage);
  const fromItem = totalItems === 0 ? 0 : startIndex + 1;
  const toItem = totalItems === 0 ? 0 : endIndex;

  const pageStart = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
  const pageEnd = Math.min(totalPages, pageStart + 2);
  const visiblePages = Array.from({ length: pageEnd - pageStart + 1 }, (_, index) => pageStart + index);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, ratingFilter, visibilityFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const toggleVisibility = async (id) => {
    const current = visibilityMap[id] ?? true;
    const nextValue = !current;

    setVisibilityMap((prev) => ({ ...prev, [id]: nextValue }));

    try {
      await api.patch(`/admin/reviews/${id}/visibility`, { is_visible: nextValue });
    } catch (err) {
      console.error("Lỗi cập nhật visibility:", err);
      alert("Cập nhật trạng thái hiển thị thất bại");
      setVisibilityMap((prev) => ({ ...prev, [id]: current }));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

    try {
      await api.delete(`/admin/reviews/${id}`);
      setReviews((prev) => prev.filter((review) => review.id !== id));
    } catch (err) {
      console.error("Lỗi xóa review:", err);
      alert("Xóa đánh giá thất bại");
    }
  };

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-semibold text-slate-800">Quản lý đánh giá khách hàng</h1>
        <p className="mt-1 text-sm text-slate-500">Theo dõi, ẩn/hiện hoặc xóa các đánh giá không phù hợp.</p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo khách hàng, dịch vụ hoặc nội dung..."
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="all">Tất cả số sao</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
          </select>

          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="visible">Đang hiển thị</option>
            <option value="hidden">Đang ẩn</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
          >
            <option value="latest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="rating_desc">Sao cao đến thấp</option>
            <option value="rating_asc">Sao thấp đến cao</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-500">
            <tr>
              <th className="p-3 text-left">Tên khách hàng</th>
              <th className="p-3 text-left">Tên dịch vụ</th>
              <th className="p-3 text-left">Số sao</th>
              <th className="p-3 text-left">Nội dung đánh giá</th>
              <th className="p-3 text-left">Ngày đánh giá</th>
              <th className="p-3 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {!loading && paginatedReviews.map((review) => {
              const isVisible = visibilityMap[review.id] ?? true;
              return (
              <tr key={review.id} className="border-b border-gray-100 text-sm">
                <td className="p-3 font-medium text-slate-800">{review.customer_name}</td>
                <td className="p-3 text-slate-700">{review.service_name}</td>
                <td className="p-3">{renderStars(Number(review.rating) || 0)}</td>
                <td className="p-3 text-slate-600">{review.comment || "-"}</td>
                <td className="p-3 text-slate-600">
                  {new Date(review.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="p-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(review.id)}
                      className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                        isVisible
                          ? "bg-sky-100 text-sky-700 hover:bg-sky-200"
                          : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                      }`}
                    >
                      {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      {isVisible ? "Ẩn" : "Hiện"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(review.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition hover:bg-red-100"
                      title="Xóa đánh giá"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}

            {loading && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  Đang tải đánh giá...
                </td>
              </tr>
            )}

            {!loading && paginatedReviews.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-500">
                  Chưa có đánh giá nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {totalItems > 0 && (
          <div className="flex flex-col gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
            <p>
              Hiển thị {fromItem} đến {toItem} của {totalItems} kết quả
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 w-9 rounded-lg border text-sm font-medium transition ${
                    page === currentPage
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviews;
