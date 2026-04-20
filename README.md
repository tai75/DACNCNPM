# 🌿 Garden Care - Dịch vụ chăm sóc cây chuyên nghiệp

Một ứng dụng web đầy đủ cho việc quản lý dịch vụ chăm sóc cây và đặt lịch, được xây dựng với React (frontend) và Node.js/Express (backend).

## ✨ Tính năng

### 👤 Người dùng
- Đăng ký/đăng nhập với xác thực JWT
- Xem danh sách dịch vụ chăm sóc cây
- Đặt lịch dịch vụ trực tuyến
- Theo dõi trạng thái đơn hàng
- Giao diện responsive và đẹp mắt

### 👨‍💼 Quản trị viên
- Quản lý người dùng (xem, chỉnh sửa vai trò)
- Quản lý dịch vụ (thêm, sửa, xóa)
<<<<<<< HEAD
- Quản lý đơn đặt lịch và gán staff
- Bảng điều khiển thống kê chi tiết
- Báo cáo doanh thu

### 👨‍🔧 Nhân viên
- Xem danh sách booking cần xử lý
- Cập nhật trạng thái booking
- Cập nhật trạng thái thanh toán booking

## 🔐 Ma trận phân quyền

| Vai trò | Quyền chính | Frontend routes | Backend phạm vi truy cập |
|---------|-------------|-----------------|---------------------------|
| Admin | Quản lý toàn bộ hệ thống | /admin/dashboard, /admin/users, /admin/services, /admin/bookings, /admin/revenue | /api/admin/*, /api/users/*, /api/revenue/*, /api/bookings/* |
| Staff | Xử lý lịch đặt dịch vụ | /staff/bookings | /api/bookings/* (xem/cập nhật trạng thái và thanh toán) |
| User (đã đăng nhập) | Đặt lịch và xem lịch sử | /booking, /bookings | /api/bookings (chỉ dữ liệu của chính mình) |
| Guest (chưa đăng nhập) | Xem dịch vụ, đăng ký, đăng nhập | /, /services, /login, /register | /api/register, /api/login, /api/services |

=======
- Quản lý đơn đặt lịch (xác nhận, hủy)
- Bảng điều khiển thống kê chi tiết
- Báo cáo doanh thu

>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
## 🛠️ Tech Stack

### Frontend
- **React 19** với Vite
- **Tailwind CSS** cho styling
- **React Router** cho routing
- **Axios** cho API calls
- **Recharts** cho biểu đồ
- **Lucide React** cho icons

### Backend
- **Node.js** với Express
- **MySQL** database
- **JWT** authentication
- **Bcrypt** password hashing
- **Joi** validation
- **Swagger** API documentation
- **Helmet** security headers
- **Morgan** logging

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js >= 16
- MySQL >= 8.0
- npm hoặc yarn

### 1. Clone repository
```bash
git clone <repository-url>
cd garden-care
```

### 2. Cài đặt dependencies

#### Backend
```bash
cd back-end
npm install
```

#### Frontend
```bash
cd front-end
npm install
```

### 4. Nhập dữ liệu mẫu (tùy chọn)
```bash
mysql -u your_username -p garden_care < database/sample_data_vietnamese.sql
```

**Tài khoản mẫu:**
- Admin: admin@gardencare.com / password123
- User: user1@gardencare.com / password123

### 4. Chạy ứng dụng

#### Terminal 1 - Backend
```bash
cd back-end
npm start
```
Server sẽ chạy tại: http://localhost:5000
API Documentation: http://localhost:5000/api-docs

#### Terminal 2 - Frontend
```bash
cd front-end
npm run dev
```
Frontend sẽ chạy tại: http://localhost:5173

## 📊 API Endpoints

### Xác thực
- `POST /api/register` - Đăng ký
- `POST /api/login` - Đăng nhập

### Dịch vụ (Công khai)
- `GET /api/services` - Lấy danh sách dịch vụ

### Đặt lịch (Đã xác thực)
- `GET /api/bookings` - Lấy danh sách booking của người dùng
- `POST /api/bookings` - Tạo booking mới
<<<<<<< HEAD
- `PUT /api/bookings/:id/status` - Cập nhật trạng thái booking (admin/staff)
- `PUT /api/bookings/:id/payment` - Cập nhật trạng thái thanh toán (admin/staff)
- `DELETE /api/bookings/:id` - Xóa booking

### Quản trị (Quản trị viên)
=======
- `PUT /api/bookings/:id` - Cập nhật trạng thái (quản trị viên only)
- `DELETE /api/bookings/:id` - Xóa booking

### Quản trị (Quản trị viên only)
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
- `GET /api/admin/dashboard` - Thống kê bảng điều khiển
- `GET /api/admin/users` - Quản lý người dùng
- `GET /api/admin/services` - Quản lý dịch vụ
- `GET /api/admin/bookings` - Quản lý bookings

<<<<<<< HEAD
### Nhân viên và quản trị
- `GET /api/bookings` - Danh sách booking (staff chỉ xem booking được giao, admin xem toàn bộ, user xem của mình)
- `PUT /api/bookings/:id/status` - Cập nhật trạng thái booking
- `PUT /api/bookings/:id/payment` - Cập nhật trạng thái thanh toán

### Quản trị nội bộ
- `GET /api/users` - Danh sách users
- `PUT /api/users/:id/role` - Cập nhật role user (user/staff/admin)
- `DELETE /api/users/:id` - Xóa user
- `GET /api/revenue` - Tổng doanh thu
- `GET /api/revenue/by-date` - Doanh thu theo ngày

=======
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
## 🧪 Testing

```bash
cd back-end
npm test
```

## 📁 Cấu trúc dự án

```
garden-care/
├── back-end/
│   ├── config/
│   │   └── db.js
│   ├── controller/
│   ├── middleware/
│   ├── routes/
│   ├── tests/
│   ├── .env
│   └── server.js
├── front-end/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── config/
│   └── vite.config.js
└── README.md
```

## 🔒 Bảo mật

- Xác thực JWT token
- Mã hóa mật khẩu với bcrypt
- Bảo vệ chống SQL injection
- Cấu hình CORS
- Headers bảo mật với Helmet
- Ghi log với Morgan

## 🎨 UI/UX Features

- Responsive design cho mọi thiết bị
- Glassmorphism effects
- Smooth animations và transitions
- Loading states
- Error handling
- Beautiful gradients và shadows

## 📈 Performance

- Code splitting với Vite
- Optimized images
- Efficient API calls
- Pagination cho large datasets
- Caching strategies

## 🤝 Đóng góp

1. Fork project
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Liên hệ

- Email: your-email@example.com
- Project Link: [GitHub Repository]

---

Made with ❤️ for beautiful gardens everywhere 🌱

Cap nhat tai lieu: bo sung ghi chu tong quan de dong bo README tren nhanh dev.
