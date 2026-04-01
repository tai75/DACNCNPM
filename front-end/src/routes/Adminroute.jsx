import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // ❌ chưa login hoặc không có token
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // ❌ không phải admin
  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  // ✅ là admin
  return children;
}

export default AdminRoute;