import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

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
import Thankyou from "./pages/Thankyou";
import BankPayment from "./pages/BankPayment";

// ADMIN
import AdminLayout from "./layouts/AdminLayout";
import AdminDashBoard from "./pages/admin/AdminDashBoard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminServices from "./pages/admin/AdminServices";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminRevenue from "./pages/admin/AdminRevenue";
import AdminRoute from "./routes/Adminroute";
import StaffLayout from "./layouts/StaffLayout";
import StaffRoute from "./routes/StaffRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import StaffBookings from "./pages/staff/StaffBookings";

/* ======================
   USER LAYOUT
====================== */
function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
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
          <Route path="bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />

          <Route path="payment" element={<Payment />} />
          <Route path="thank-you" element={<Thankyou />} />
          <Route path="bank-payment" element={<BankPayment />} />
        </Route>

        {/* ================= ADMIN ================= */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route path="dashboard" element={<AdminDashBoard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="employees" element={<AdminEmployees />} />
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