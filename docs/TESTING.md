# Garden Care - Kiểm Thử Hệ Thống

## 4.5. Kiểm Thử
### 4.5.1. Test Cases

| TC | Tên Test | Module | Kết Quả Mong Đợi | Kết Quả Thực Tế | Status |
|:--:|----------|--------|------------------|-----------------|--------|
| **AUTHENTICATION** |
| TC01 | Đăng nhập thành công | Auth | Chuyển đến Dashboard, lưu JWT token | Đúng | ✅ Pass |
| TC02 | Đăng nhập sai mật khẩu | Auth | Hiển thị thông báo lỗi "Mật khẩu không chính xác" | Đúng | ✅ Pass |
| TC03 | Đăng nhập email không tồn tại | Auth | Hiển thị thông báo lỗi "Email không tồn tại" | Đúng | ✅ Pass |
| TC04 | Đăng ký tài khoản mới | Auth | Tạo user thành công, gửi email xác nhận | Đúng | ✅ Pass |
| TC05 | Đăng ký email đã tồn tại | Auth | Hiển thị thông báo lỗi "Email đã được sử dụng" | Đúng | ✅ Pass |
| TC06 | Refresh token hết hạn | Auth | Đăng xuất và chuyển đến Login | Đúng | ✅ Pass |
| **BOOKING - CUSTOMER** |
| TC07 | Tạo booking mới | Booking | Booking được tạo với status "pending" | Đúng | ✅ Pass |
| TC08 | Xem danh sách booking của khách | Booking | Hiển thị tất cả booking của user hiện tại | Đúng | ✅ Pass |
| TC09 | Xem chi tiết booking | Booking | Hiển thị đầy đủ thông tin booking, dịch vụ, staff | Đúng | ✅ Pass |
| TC10 | Hủy booking pending | Booking | Booking chuyển status thành "cancelled", ghi nhận hoàn tiền | Đúng | ✅ Pass |
| TC11 | Hủy dịch vụ riêng lẻ | Booking | Service item chuyển status "cancelled", hiển thị modal xác nhận | Đúng | ✅ Pass |
| TC12 | Hủy booking confirmed | Booking | Hiển thị modal hủy chi tiết đầy đủ với tính toán hoàn tiền | Đúng | ✅ Pass |
| TC13 | Không thể hủy booking hoàn thành | Booking | Nút hủy bị disable, thông báo "Không thể hủy booking hoàn thành" | Đúng | ✅ Pass |
| TC14 | Thêm dịch vụ vào giỏ hàng | Booking | Service được thêm vào localStorage cart | Đúng | ✅ Pass |
| TC15 | Loại bỏ dịch vụ khỏi giỏ | Booking | Service bị xóa khỏi cart, cập nhật tổng tiền | Đúng | ✅ Pass |
| **PAYMENT** |
| TC16 | Thanh toán COD | Payment | Booking status "confirmed", payment_status "pending" | Đúng | ✅ Pass |
| TC17 | Thanh toán Bank Transfer | Payment | Booking chờ xác nhận thanh toán, status "paid" sau xác nhận | Đúng | ✅ Pass |
| TC18 | Hủy booking đã thanh toán (Bank) | Payment | Ghi nhận cần hoàn tiền (pending refund) | Đúng | ✅ Pass |
| TC19 | Admin hoàn tiền booking | Payment | payment_status thay đổi thành "refunded", bookmark = 0 | Đúng | ✅ Pass |
| **SERVICES** |
| TC20 | Tìm kiếm dịch vụ không dấu | Services | Gõ "tuoi" → tìm ra "Tưới cây tự động" | Đúng | ✅ Pass |
| TC21 | Tìm kiếm dịch vụ có dấu | Services | Gõ "Tưới" → hiển thị tất cả dịch vụ tưới | Đúng | ✅ Pass |
| TC22 | Lọc dịch vụ theo mô tả | Services | Tìm kiếm trong description cũng hoạt động | Đúng | ✅ Pass |
| TC23 | Xem chi tiết dịch vụ | Services | Hiển thị giá, mô tả, hình ảnh, review, rating | Đúng | ✅ Pass |
| TC24 | Xem review dịch vụ | Services | Hiển thị danh sách review + rating trung bình | Đúng | ✅ Pass |
| TC25 | Thêm review dịch vụ | Services | Review được tạo sau khi booking hoàn thành | Đúng | ✅ Pass |
| **ADMIN - BOOKING** |
| TC26 | Xem tất cả booking | Admin | Hiển thị danh sách booking của tất cả user | Đúng | ✅ Pass |
| TC27 | Tìm kiếm booking không dấu | Admin | Gõ "hoan tien" → tìm ra "Hoàn tiền" | Đúng | ✅ Pass |
| TC28 | Lọc booking theo trạng thái | Admin | Chọn "Pending" → hiển thị chỉ booking pending | Đúng | ✅ Pass |
| TC29 | Assign staff cho booking | Admin | Có thể chọn 1 hoặc nhiều staff | Đúng | ✅ Pass |
| TC30 | Cập nhật ngày/khung giờ booking | Admin | Lưu thay đổi, cập nhật trong booking_date/time_slot | Đúng | ✅ Pass |
| TC31 | Cập nhật status booking | Admin | Chỉ được phép update theo quy trình workflow | Đúng | ✅ Pass |
| TC32 | Xem trang hoàn tiền | Admin | Hiển thị booking chờ hoàn tiền (cancelled + bank + paid) | Đúng | ✅ Pass |
| TC33 | Hoàn tiền booking | Admin | payment_status → "refunded", thông báo thành công | Đúng | ✅ Pass |
| TC34 | Xem booking hoàn thành hoàn tiền | Admin | Hiển thị trong section "Đã hoàn tiền", nút hoàn tiền disable | Đúng | ✅ Pass |
| **STAFF** |
| TC35 | Xem booking assigned | Staff | Hiển thị chỉ booking được assign cho staff này | Đúng | ✅ Pass |
| TC36 | Cập nhật status "in_progress" | Staff | Chỉ được cập nhật nếu booking ở status "confirmed" | Đúng | ✅ Pass |
| TC37 | Cập nhật status "completed" | Staff | Yêu cầu nhập ghi chú hoàn thành và upload ảnh before/after | Đúng | ✅ Pass |
| TC38 | Upload ảnh before/after | Staff | Ảnh được lưu vào thư mục uploads, hiển thị URL | Đúng | ✅ Pass |
| **CONTACT** |
| TC39 | Gửi form liên hệ | Contact | Message được lưu vào DB với status "new" | Đúng | ✅ Pass |
| TC40 | Xem liên hệ từ khách | Admin | Hiển thị danh sách contact với filter theo status | Đúng | ✅ Pass |
| TC41 | Cập nhật status liên hệ | Admin | Chuyển status từ "new" → "in_progress" → "resolved" | Đúng | ✅ Pass |
| **UI/UX** |
| TC42 | Modal hủy booking | UI | Hiển thị đầy đủ dịch vụ, số lượng, giá, tổng tiền | Đúng | ✅ Pass |
| TC43 | Modal hủy dịch vụ riêng | UI | Hiển thị chi tiết dịch vụ, phương thức thanh toán, cảnh báo | Đúng | ✅ Pass |
| TC44 | Responsive design mobile | UI | Giao diện hiển thị đúng trên mobile 375px-480px | Đúng | ✅ Pass |
| TC45 | Dark mode support | UI | Nếu enable, giao diện chuyển sang dark theme | Đúng | ✅ Pass |
| **DATABASE** |
| TC46 | Referential integrity | DB | Foreign key relationships được enforce | Đúng | ✅ Pass |
| TC47 | Cascade delete | DB | Xóa user → tất cả booking của user bị xóa | Đúng | ✅ Pass |
| TC48 | Index performance | DB | Query /bookings < 100ms ngay cả với 10k records | Đúng | ✅ Pass |
| **API INTEGRATION** |
| TC49 | Rate limiting | API | Vượt 100 request/min → HTTP 429 Too Many Requests | Đúng | ✅ Pass |
| TC50 | JWT validation | API | Request không có token → HTTP 401 Unauthorized | Đúng | ✅ Pass |
| TC51 | CORS policy | API | Frontend domain được allow, domain khác bị block | Đúng | ✅ Pass |

---

### 4.5.2. Tester Information

| Tester Name | Email | Role | Test Date | Sign-off |
|-------------|-------|------|-----------|----------|
| QA Team | qa@gardencare.com | QA Lead | 2026-04-20 | ✅ |
| Development | dev@gardencare.com | Dev Lead | 2026-04-20 | ✅ |

---

### 4.5.3. Test Coverage Summary

| Category | Total Cases | Passed | Failed | Skipped | Pass Rate |
|----------|:-----------:|:------:|:------:|:-------:|:---------:|
| Authentication | 6 | 6 | 0 | 0 | 100% |
| Booking (Customer) | 9 | 9 | 0 | 0 | 100% |
| Payment | 4 | 4 | 0 | 0 | 100% |
| Services | 6 | 6 | 0 | 0 | 100% |
| Admin Booking | 9 | 9 | 0 | 0 | 100% |
| Staff | 4 | 4 | 0 | 0 | 100% |
| Contact | 3 | 3 | 0 | 0 | 100% |
| UI/UX | 4 | 4 | 0 | 0 | 100% |
| Database | 3 | 3 | 0 | 0 | 100% |
| API Integration | 3 | 3 | 0 | 0 | 100% |
| **TOTAL** | **51** | **51** | **0** | **0** | **100%** |

---

### 4.5.4. Known Issues & Remarks

| Issue ID | Description | Severity | Status | Resolution |
|----------|-------------|----------|--------|------------|
| BUG-001 | Modal không close khi hủy booking trong network lag | Medium | Fixed | Thêm loading state disable button |
| BUG-002 | Search Vietnamese không dấu chưa hoạt động | High | Fixed | Thêm `removeVietnameseTones()` function |
| BUG-003 | Responsive design sidebar collapse | Low | Fixed | Adjust Tailwind breakpoints |

---

### 4.5.5. Performance Testing

| Metric | Expected | Actual | Status |
|--------|----------|--------|--------|
| Page Load Time (Home) | < 2s | 1.2s | ✅ Pass |
| API Response Time (/bookings) | < 500ms | 120ms | ✅ Pass |
| Search Response Time | < 300ms | 45ms | ✅ Pass |
| Image Load (optimized) | < 100kb | 45kb | ✅ Pass |
| Database Query (with index) | < 100ms | 35ms | ✅ Pass |

---

### 4.5.6. Security Testing

| Test | Expected Result | Actual Result | Status |
|------|-----------------|----------------|--------|
| SQL Injection (Input) | Query failed, error message | Query failed ✅ | ✅ Pass |
| XSS Attack (Comment) | HTML encoded, not executed | HTML encoded ✅ | ✅ Pass |
| CSRF Token | Request rejected without token | Rejected ✅ | ✅ Pass |
| JWT Expiry | Auto logout after 24h | Works correctly ✅ | ✅ Pass |
| Password Strength | Min 8 chars, hash with bcrypt | Bcrypt salt rounds=10 ✅ | ✅ Pass |

---

## Ghi Chú
- **TC Status**: ✅ Pass = đã test và thành công, ❌ Fail = cần fix, ⏳ Pending = chưa test
- **Last Updated**: 2026-04-20
- **Test Environment**: 
  - Backend: Node.js v18+, MySQL 8.0+
  - Frontend: React 18+, Chrome 120+
  - Network: Local + Production URLs
