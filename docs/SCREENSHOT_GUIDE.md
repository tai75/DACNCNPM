# 5. Kết Quả & Demo

## 5.1. Tổng Quan Tính Năng

Hệ thống Garden Care hoàn tất với các chức năng chính:
- ✅ Quản lý booking (khách, nhân viên, quản trị)
- ✅ Hệ thống thanh toán & hoàn tiền
- ✅ Quản lý dịch vụ & tìm kiếm nâng cao
- ✅ Hệ thống review & đánh giá
- ✅ Quản lý liên hệ & hỗ trợ khách hàng

---

## 5.2. Screenshots Sản Phẩm

### 5.2.1. Giao Diện Khách Hàng (Customer)

#### Screenshot 1: Trang Chủ (Home)
**Vị trí file:** `front-end/src/pages/Home.jsx`
**Mô tả:** 
- Hero section với hình nền sân vườn đẹp
- Navigation bar (Login/Register hoặc Menu user)
- CTA button "Đặt lịch ngay"
- Danh sách dịch vụ nổi bật
- Section testimonials/review từ khách hàng

**Chụp:** 
```
Ctrl+P hoặc F12 → Devices → Pixel 5/iPhone 12 để responsive
Toàn bộ trang từ trên xuống dưới
```

---

#### Screenshot 2: Trang Dịch Vụ - Tìm Kiếm (Services)
**Vị trí file:** `front-end/src/pages/Services.jsx`
**Mô tả:**
- Search bar "Tìm kiếm dịch vụ"
- **Chỉ ra:** Tìm kiếm không dấu (gõ "tuoi" → tìm ra "Tưới cây tự động") ⭐
- Danh sách dịch vụ dạng grid 3 cột
- Service card: hình ảnh, tên, giá, nút "Xem chi tiết"

**Chụp:**
```
1. Toàn bộ trang danh sách dịch vụ
2. Close-up search bar
3. Grid service card (để thấy design)
4. Tìm kiếm "tuoi" → kết quả (chứng minh tìm kiếm không dấu)
```

---

#### Screenshot 3: Chi Tiết Dịch Vụ (Service Detail)
**Vị trí file:** `front-end/src/pages/ServiceDetail.jsx`
**Mô tả:**
- Hình ảnh dịch vụ to
- Tiêu đề, giá, mô tả chi tiết
- Tab "Giới thiệu", "Review", "FAQ"
- Section review: danh sách review, rating ⭐ trung bình
- Nút "Thêm vào giỏ" / "Đặt lịch"
- Comment form để thêm review

**Chụp:**
```
1. Header phần (hình ảnh + info cơ bản)
2. Description & tab
3. Review section với ratings
4. Comment form ở cuối
```

---

#### Screenshot 4: Giỏ Hàng & Đặt Lịch (Booking)
**Vị trí file:** `front-end/src/pages/Booking.jsx`
**Mô tả:**
- Danh sách dịch vụ đã chọn (service items)
- Nút xóa dịch vụ
- Form đặt lịch: 
  - Ngày, khung giờ
  - Địa chỉ
  - Ghi chú
  - Phương thức thanh toán (COD / Bank Transfer)
- Tóm tắt giá cuối cùng
- Nút "Đặt lịch"

**Chụp:**
```
1. Full page từ trên xuống
2. Close-up form đặt lịch
3. Payment method radio buttons
4. Tóm tắt giá ở cuối
```

---

#### Screenshot 5: Danh Sách Booking - Lịch Sử (Bookings)
**Vị trí file:** `front-end/src/pages/Bookings.jsx`
**Mô tả:**
- Danh sách booking của khách hàng
- Filter theo trạng thái: pending, confirmed, completed, cancelled
- Mỗi booking card: mã, ngày, dịch vụ, giá, status
- Nút "Xem chi tiết", "Hủy booking"

**Chụp:**
```
1. Danh sách booking table/card
2. Filter status active
3. Booking card với các nút action
```

---

#### Screenshot 6: Chi Tiết Booking (BookingDetail)
**Vị trị file:** `front-end/src/pages/BookingDetail.jsx`
**Mô tả:** ⭐ **QUAN TRỌNG** - Thể hiện tính năng modal mới
- Thông tin booking (mã, ngày, khung giờ, địa chỉ)
- Status badge (pending/confirmed/completed)
- Danh sách dịch vụ:
  - Ảnh dịch vụ, tên, số lượng, giá
  - Nút "Hủy" cho từng dịch vụ
- Dịch vụ đã hủy (gạch chéo, opacity thấp)
- Tóm tắt giá
- Thông tin khách hàng, nhân viên

**Chụp:**
```
1. Toàn bộ chi tiết booking
2. Danh sách dịch vụ (highlight nút "Hủy")
3. Section dịch vụ đã hủy (để thấy UI khác biệt)
```

---

#### Screenshot 7: Modal Hủy Booking ⭐
**Vị trị file:** `front-end/src/components/CancelBookingModal.jsx`
**Mô tả:** **MỚI & QUAN TRỌNG**
- Header gradient (slate-900 → emerald)
- Danh sách service items trong booking:
  - Ảnh, tên, số lượng, giá từng item
  - Tính toán total price
- Phương thức thanh toán (ngân hàng/COD)
- Warning box: "Xác nhận hủy - Hành động không thể hoàn tác"
- Nút "Không" / "Hủy đơn"

**Chụp:**
```
1. Modal hủy booking (toàn bộ)
2. Close-up danh sách dịch vụ trong modal
3. Close-up warning box + buttons
```

---

#### Screenshot 8: Modal Hủy Dịch Vụ Riêng Lẻ ⭐
**Vị trị file:** `front-end/src/components/CancelServiceItemModal.jsx`
**Mô tả:** **MỚI & QUAN TRỌNG**
- Header gradient
- Service item card: hình ảnh to, tên, số lượng, giá, tổng tiền
- Payment info box (amber): phương thức thanh toán + lưu ý hoàn tiền nếu bank+paid
- Warning box (rose)
- Nút "Không" / "Hủy dịch vụ"

**Chụp:**
```
1. Modal hủy dịch vụ (toàn bộ)
2. Payment info section (thể hiện logic hoàn tiền)
3. Buttons ở cuối
```

---

#### Screenshot 9: Trang Thanh Toán (Payment)
**Vị trị file:** `front-end/src/pages/Payment.jsx`
**Mô tả:**
- Tóm tắt booking (dịch vụ, tổng tiền)
- Phương thức thanh toán:
  - COD (Thanh toán khi nhận dịch vụ)
  - Bank Transfer (hiển thị account info, QR code)
- Status: pending → paid → confirmed
- Nút "Xác nhận thanh toán"

**Chụp:**
```
1. Payment page toàn bộ
2. COD option
3. Bank Transfer option (QR code)
```

---

#### Screenshot 10: Thông Tin Cá Nhân (UserInfo)
**Vị trị file:** `front-end/src/pages/UserInfo.jsx`
**Mô tả:**
- Thông tin user (tên, email, số điện thoại)
- Avatar / profile picture
- Nút "Chỉnh sửa", "Đổi mật khẩu"
- Form update thông tin

**Chụp:**
```
1. Profile page
2. Edit form (nếu có)
```

---

### 5.2.2. Giao Diện Admin

#### Screenshot 11: Dashboard Admin (Admin Home)
**Vị trị file:** `front-end/src/pages/admin/AdminHome.jsx`
**Mô tả:**
- Summary cards: tổng booking, pending, confirmed, completed, revenue
- Chart doanh thu theo tháng/ngày
- Recent bookings list
- Quick stats

**Chụp:**
```
1. Dashboard toàn bộ
2. Summary cards (close-up)
3. Revenue chart
```

---

#### Screenshot 12: Quản Lý Booking - Admin (AdminBookings) ⭐
**Vị trị file:** `front-end/src/pages/admin/AdminBookings.jsx`
**Mô tả:** **ĐÃ OPTIMIZE - Không có refund UI**
- Search bar: tìm booking không dấu
- Filter: theo status (all/pending/confirmed/in_progress/completed/cancelled)
- Bảng booking: 
  - Mã booking, khách hàng, dịch vụ, ngày, trạng thái, nhân viên
  - Assign staff (dropdown/multi-select)
  - Update status (select)
  - Update ngày/khung giờ (date/time picker)
- Payment column: status badge, link "Đi tới trang hoàn tiền" nếu cần

**Chụp:**
```
1. Danh sách booking (admin view)
2. Search bar (gõ từ không dấu)
3. Bảng chi tiết rows
4. Assign staff dropdown
5. Status update select
6. Link "Đi tới trang hoàn tiền" (nếu có)
```

---

#### Screenshot 13: Trang Hoàn Tiền - Admin (AdminRefunds) ⭐
**Vị trị file:** `front-end/src/pages/admin/AdminRefunds.jsx`
**Mô tả:** **MỚI - SEPARATE PAGE**
- Header: tổng pending refunds
- **Section 1: Chờ hoàn tiền (Pending Refunds)**
  - Search bar
  - Booking cards: ảnh dịch vụ overlapping, tên khách, địa chỉ, số dịch vụ, tổng giá
  - "Chờ hoàn tiền" badge (amber)
  - Nút "Hoàn tiền" (enabled)
- **Section 2: Đã hoàn tiền (Completed Refunds)**
  - Danh sách booking đã refund
  - "Đã hoàn tiền" badge (rose)
  - Nút "Hoàn tiền" (disabled)

**Chụp:**
```
1. Trang refund toàn bộ
2. Pending refunds section + cards
3. Completed refunds section
4. Close-up booking card (ảnh overlapping)
5. Nút hoàn tiền (enabled vs disabled)
```

---

#### Screenshot 14: Quản Lý Dịch Vụ (AdminServices)
**Vị trị file:** `front-end/src/pages/admin/AdminServices.jsx`
**Mô tả:**
- Danh sách dịch vụ table
- Nút "Thêm dịch vụ mới"
- Mỗi row: tên, giá, mô tả, hình ảnh, action (edit/delete)
- Form thêm/sửa dịch vụ (modal hoặc page)

**Chụp:**
```
1. Danh sách dịch vụ
2. Add/Edit form
```

---

#### Screenshot 15: Quản Lý Liên Hệ (AdminContacts)
**Vị trị file:** `front-end/src/pages/admin/AdminContacts.jsx`
**Mô tả:**
- Danh sách contact từ khách hàng
- Filter status: new, in_progress, resolved
- Search bar (tìm theo tên, email, subject)
- Mỗi contact: tên, email, chủ đề, status, action (view/update/delete)
- Modal/page để xem chi tiết và update status

**Chụp:**
```
1. Danh sách contact
2. Filter status active
3. Contact card chi tiết
```

---

#### Screenshot 16: Dashboard Doanh Thu (RevenueChart)
**Vị trị file:** `front-end/src/pages/admin/RevenueChart.jsx`
**Mô tả:**
- Chart doanh thu: theo ngày/tuần/tháng
- Bảng chi tiết: ngày, số booking, tổng doanh thu
- Filter theo date range
- Export data nút

**Chụp:**
```
1. Revenue chart
2. Data table
3. Filter controls
```

---

### 5.2.3. Giao Diện Nhân Viên (Staff)

#### Screenshot 17: Danh Sách Booking - Nhân Viên (StaffBookings)
**Vị trị file:** `front-end/src/pages/staff/StaffBookings.jsx`
**Mô tả:**
- Danh sách booking được assign cho staff
- Filter status: pending, confirmed, in_progress, completed
- Mỗi booking card: mã, khách, dịch vụ, địa chỉ, ngày, status
- Nút "Xem chi tiết", "Cập nhật trạng thái"

**Chụp:**
```
1. Staff booking list
2. Booking card (chi tiết)
3. Status filter active
```

---

#### Screenshot 18: Cập Nhật Trạng Thái Booking - Nhân Viên ⭐
**Vị trị file:** `front-end/src/pages/staff/StaffBookingDetail.jsx` hoặc modal
**Mô tả:**
- Từng bước workflow:
  - pending → confirmed (admin only)
  - confirmed → in_progress (staff start)
  - in_progress → completed (staff finish)
- Form completion: nhập ghi chú, upload ảnh before/after
- Nút "Lưu" / "Hoàn thành"

**Chụp:**
```
1. Staff booking detail
2. Status update form
3. Before/After image upload
4. Completion note textarea
```

---

### 5.2.4. Giao Diện Auth & Common

#### Screenshot 19: Đăng Nhập (Login)
**Vị trị file:** `front-end/src/pages/Login.jsx`
**Mô tả:**
- Email input
- Password input
- Remember me checkbox
- "Quên mật khẩu?" link
- Nút "Đăng nhập"
- "Đăng ký tài khoản" link

**Chụp:**
```
1. Login form
2. Mobile version (responsive)
```

---

#### Screenshot 20: Đăng Ký (Register)
**Vị trị file:** `front-end/src/pages/Register.jsx`
**Mô tả:**
- Tên, Email, Số điện thoại inputs
- Password, Confirm password
- Terms & conditions checkbox
- Nút "Đăng ký"

**Chụp:**
```
1. Register form
```

---

#### Screenshot 21: Navigation & Layout
**Vị trị file:** `front-end/src/components/Navbar.jsx`, `AdminLayout.jsx`
**Mô tả:**
- Navbar với logo, menu links, user profile dropdown
- Sidebar menu (admin/staff): Dashboard, Booking, Services, Refund, Contacts, Revenue
- Active link highlight
- Responsive mobile menu (hamburger)

**Chụp:**
```
1. Desktop navbar + sidebar
2. Mobile navbar (collapsed)
3. User profile dropdown
```

---

#### Screenshot 22: Footer
**Vị trị file:** `front-end/src/components/Footer.jsx`
**Mô tả:**
- Logo, tagline
- Quick links
- Social media icons
- Copyright info

**Chụp:**
```
1. Footer (bottom of any page)
```

---

#### Screenshot 23: Responsive Mobile Design ⭐
**Mô tả:** **QUAN TRỌNG - Thể hiện responsive design**
- Home page trên mobile (375px - 480px)
- Services list trên mobile
- Booking detail trên mobile
- Modal hủy trên mobile

**Chụp:**
```
1. Home page - mobile
2. Services - mobile
3. BookingDetail - mobile
4. Modal - mobile (thấy chiều cao scroll)
```

---

### 5.2.5. Tính Năng Nổi Bật

#### Screenshot 24: Vietnamese Search (Tìm Kiếm Không Dấu) ⭐
**Thể hiện:** Services.jsx, AdminBookings.jsx, AdminRefunds.jsx
**Kỹ thuật:** `removeVietnameseTones()` function
**Chụp:**
```
1. Search bar trong Services
2. Gõ "tuoi" (không dấu) → kết quả "Tưới cây tự động" (có dấu) ✅
3. Gõ "phun" (không dấu) → "Phun thuốc trừ sâu" ✅
4. Admin search: gõ "hoan tien" → tìm ra "Hoàn tiền" ✅
```

---

#### Screenshot 25: Refund Logic (Hoàn Tiền Thông Minh) ⭐
**Thể hiện:** Booking cancelled + Bank method + Paid status
**Chụp:**
```
1. Booking pending COD → hủy → không hiển thị trong refund page
2. Booking confirmed Bank (paid) → hủy → hiển thị trong pending refund
3. Admin hoàn tiền → booking chuyển sang "Đã hoàn tiền" section
```

---

#### Screenshot 26: Modal Design Consistency ⭐
**Thể hiện:** CancelBookingModal vs CancelServiceItemModal
**Chụp:**
```
1. Modal hủy booking (toàn bộ booking)
2. Modal hủy dịch vụ (riêng lẻ)
3. So sánh: cấu trúc tương tự, gradient header, warning box, buttons
```

---

### 5.2.6. Error Handling & Edge Cases

#### Screenshot 27: Validation & Error Messages
**Chụp:**
```
1. Form validation error (tên trống → red border + error text)
2. Login fail error (wrong password, email not found)
3. API error (network error banner)
```

---

#### Screenshot 28: Empty State
**Chụp:**
```
1. Không có booking → "Chưa có booking nào"
2. Không có contact → "Chưa có liên hệ"
3. Search không có kết quả → "Không tìm thấy dịch vụ phù hợp"
```

---

### 5.2.7. Loading & Transition States

#### Screenshot 29: Loading State
**Chụp:**
```
1. Loading spinner (khi fetch data)
2. Skeleton loading (nếu có)
```

---

#### Screenshot 30: Button States
**Chụp:**
```
1. Button normal state
2. Button hover state
3. Button disabled state (nút hoàn tiền đã hoàn xong)
4. Button loading state (Đang hủy...)
```

---

## 5.2.8. Hướng Dẫn Chụp Screenshot

### Công Cụ
- **Browser DevTools:** F12 → Device Emulation (Pixel 5, iPhone 12, Desktop)
- **Windows Screenshot:** Windows + Shift + S
- **Snipping Tool:** Mở "Snipping Tool" in Windows
- **FastStone Capture:** Screenshot tool chuyên nghiệp (optional)

### Khi chụp
1. **Scroll hết trang** nếu muốn toàn bộ (có thể dùng full-page screenshot plugin)
2. **Highlight UI changes** bằng annotation hoặc arrow
3. **Show before/after** nếu có logic thay đổi (e.g., before cancel, after cancel)
4. **Mobile responsive:** Chụp cả desktop (1920x1080) và mobile (375x812)

### Tổ Chức
```
📁 docs/
  📁 screenshots/
    📁 01-customer/
      - 01-home.png
      - 02-services-list.png
      - 03-service-detail.png
      - 04-booking-form.png
      - 05-booking-history.png
      - 06-booking-detail.png
      - 07-modal-cancel-booking.png
      - 08-modal-cancel-service.png
      - 09-payment.png
      - 10-user-info.png
    📁 02-admin/
      - 11-dashboard.png
      - 12-admin-bookings.png
      - 13-admin-refunds.png
      - 14-admin-services.png
      - 15-admin-contacts.png
      - 16-revenue.png
    📁 03-staff/
      - 17-staff-bookings.png
      - 18-staff-update-status.png
    📁 04-auth-common/
      - 19-login.png
      - 20-register.png
      - 21-navbar-layout.png
      - 22-footer.png
      - 23-responsive-mobile.png
    📁 05-features/
      - 24-vietnamese-search.png
      - 25-refund-logic.png
      - 26-modal-consistency.png
      - 27-error-handling.png
      - 28-empty-state.png
      - 29-loading-state.png
      - 30-button-states.png
```

---

## 5.3. Chất Lượng Ảnh Chụp

| Tiêu Chí | Yêu Cầu |
|----------|---------|
| **Độ phân giải** | 1920x1080 (desktop) hoặc 375x812 (mobile) |
| **Format** | PNG hoặc JPEG (PNG tốt hơn để giữ chất lượng) |
| **Dung lượng** | ≤ 500KB mỗi file |
| **Dòng chữ rõ ràng** | Font size ≥ 12px |
| **Không blur/mờ** | Chụp rõ, không motion blur |
| **Thời lượng** | Chụp trong giờ làm việc (sáng) để màu sắc đẹp |

---

## 5.4. Cách Nhúng Screenshot vào Báo Cáo

### Markdown
```markdown
#### Screenshot 1: Trang Chủ
![Home Page](docs/screenshots/01-customer/01-home.png)
*Hình 5.1: Giao diện trang chủ Garden Care*
```

### HTML
```html
<figure>
  <img src="docs/screenshots/01-customer/01-home.png" alt="Home Page" style="max-width: 100%; border-radius: 8px;">
  <figcaption>Hình 5.1: Giao diện trang chủ Garden Care</figcaption>
</figure>
```

### Word/Google Docs
- Insert → Image → Upload từ thư mục screenshots
- Thêm caption (Insert → Caption)

---

## Kết Luận

**Tổng cộng: 30 screenshots** cover toàn bộ tính năng từ customer → admin → staff, bao gồm:
- ✅ User workflows (booking, payment, cancellation)
- ✅ Admin workflows (manage bookings, refunds, services)
- ✅ Staff workflows (view assigned jobs, update status)
- ✅ Key features (Vietnamese search, refund logic, modals)
- ✅ UI/UX improvements (responsive design, empty states, loading)
- ✅ Error handling & edge cases

