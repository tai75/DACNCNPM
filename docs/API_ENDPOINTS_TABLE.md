| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | /api/auth/register | Đăng ký tài khoản | Public |
| POST | /api/auth/login | Đăng nhập | Public |
| GET | /api/users/profile | Lấy thông tin profile | Required |
| PUT | /api/users/profile | Cập nhật profile | Required |
| PUT | /api/users/change-password | Đổi mật khẩu | Required |
| GET | /api/users | Lấy danh sách users | Admin |
| DELETE | /api/users/:id | Xóa user | Admin |
| PUT | /api/users/:id/role | Cập nhật role user | Admin |
| GET | /api/bookings | Lấy danh sách bookings | Required |
| GET | /api/bookings/check-availability | Kiểm tra nhân viên trống | Required |
| GET | /api/bookings/:id | Lấy chi tiết booking | Required |
| POST | /api/bookings | Tạo booking mới | User |
| PUT | /api/bookings/:id/status | Cập nhật trạng thái booking | Admin, Staff |
| PUT | /api/bookings/:id/payment | Cập nhật trạng thái thanh toán | Required |
| PUT | /api/bookings/:id/confirm-bank | Xác nhận thanh toán ngân hàng | Required |
| PUT | /api/bookings/:id/assign-staff | Gán nhân viên cho booking | Admin |
| PUT | /api/bookings/:id/completion | Hoàn tất booking | Staff, Admin |
| PUT | /api/bookings/:id/schedule | Cập nhật lịch booking | Required |
| DELETE | /api/bookings/:id | Hủy booking | Required |
| DELETE | /api/bookings/:id/items/:itemId | Hủy một dịch vụ trong booking | Required |
| GET | /api/services | Lấy danh sách dịch vụ | Public |
| GET | /api/services/:id | Lấy chi tiết dịch vụ | Public |
| POST | /api/services | Tạo dịch vụ mới | Admin |
| PUT | /api/services/:id | Cập nhật dịch vụ | Admin |
| DELETE | /api/services/:id | Xóa dịch vụ | Admin |
| POST | /api/reviews | Tạo review | User |
| GET | /api/reviews/service/:service_id | Lấy tất cả review cho dịch vụ | Public |
| GET | /api/reviews/check/:id | Kiểm tra user đã review booking | Required |
| GET | /api/reviews/user/my-reviews | Lấy review của user hiện tại | User |
| POST | /api/contacts | Gửi liên hệ | Public |
| GET | /api/contacts | Lấy danh sách contact | Admin |
| PUT | /api/contacts/:id/status | Cập nhật trạng thái contact | Admin |
| DELETE | /api/contacts/:id | Xóa contact | Admin |
| GET | /api/revenue | Lấy doanh thu tổng quát | Admin |
| GET | /api/revenue/by-date | Lấy doanh thu theo ngày | Admin |
| GET | /api/admin/dashboard | Lấy thống kê dashboard | Admin |
| GET | /api/admin/staff | Lấy danh sách nhân viên | Admin |
| GET | /api/admin/staff/:id/schedule | Lấy lịch làm việc nhân viên | Admin |
| GET | /api/admin/reviews | Lấy danh sách review (Admin) | Admin |
| PATCH | /api/admin/reviews/:id/visibility | Ẩn/hiện review | Admin |
| DELETE | /api/admin/reviews/:id | Xóa review | Admin |
