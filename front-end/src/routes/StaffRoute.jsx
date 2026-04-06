import { Navigate } from "react-router-dom";

function StaffRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "staff") {
    return <Navigate to="/" />;
  }

  return children;
}

export default StaffRoute;
