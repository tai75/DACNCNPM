import { useNavigate } from "react-router-dom";

function Success() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-50 text-center">

      <h1 className="text-3xl font-bold text-green-700 mb-4">
        🎉 Đặt lịch thành công!
      </h1>

      <p className="text-gray-600 mb-6">
        Chúng tôi sẽ liên hệ với bạn sớm nhất.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
      >
        Về trang chủ
      </button>

    </div>
  );
}

export default Success;