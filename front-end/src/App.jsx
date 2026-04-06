import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";

// USER LAYOUT
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// PAGES USER
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import Bookings from "./pages/Bookings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Payment from "./pages/Payment";
import BankPayment from "./pages/BankPayment";
import UserInfo from "./pages/UserInfo";

// ADMIN
import AdminLayout from "./layouts/AdminLayout";
import AdminDashBoard from "./pages/admin/AdminDashBoard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminServices from "./pages/admin/AdminServices";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminStaff from "./pages/admin/AdminStaff";
import AdminRoute from "./routes/Adminroute";
import StaffLayout from "./layouts/StaffLayout";
import StaffRoute from "./routes/StaffRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import StaffBookings from "./pages/staff/StaffBookings";

/* ======================
   USER LAYOUT
====================== */
function UserLayout() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  let role = null;
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const isHomePage = location.pathname === "/";

  try {
    const rawUser = localStorage.getItem("user");
    role = rawUser ? JSON.parse(rawUser)?.role : null;
  } catch {
    role = null;
  }

  if (token && role === "admin") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (token && role === "staff") {
    return <Navigate to="/staff/bookings" replace />;
  }

  if (token && role === "user" && isAuthPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAuthPage && <Navbar />}

      <main className="flex flex-1">
        <div
          className={
            isAuthPage
              ? "flex w-full flex-1"
              : `mx-auto flex w-full max-w-7xl flex-1 px-4 md:px-6 ${isHomePage ? "" : "pt-6 md:pt-8"}`
          }
        >
          <Outlet />
        </div>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}

/* ======================
   APP
====================== */
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= USER ================= */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />

          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetail />} />

          <Route path="booking" element={<Booking />} />
          <Route path="profile" element={<ProtectedRoute><UserInfo /></ProtectedRoute>} />
          <Route path="bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />

          <Route path="payment" element={<Payment />} />
          <Route path="bank-payment" element={<BankPayment />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="dashboard" element={<AdminDashBoard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="revenue" element={<AdminRevenue />} />
        </Route>

        {/* ================= STAFF ================= */}
        <Route path="/staff" element={<StaffRoute><StaffLayout /></StaffRoute>}>
          <Route path="bookings" element={<StaffBookings />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;