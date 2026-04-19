-- Garden Care Database - Dữ liệu mẫu tiếng Việt

-- Chèn dữ liệu mẫu cho bảng services
INSERT INTO services (name, description, price, image) VALUES
('Cắt tỉa cây cảnh', 'Dịch vụ cắt tỉa chuyên nghiệp cho cây cảnh trong nhà và ngoài trời', 150000, 'service-pruning.jpg'),
('Bón phân định kỳ', 'Bón phân organic cho cây, giúp cây phát triển khỏe mạnh', 100000, 'service-fertilizing.jpg'),
('Phun thuốc trừ sâu', 'Phun thuốc an toàn, bảo vệ cây khỏi sâu bệnh', 200000, 'service-spraying.jpg'),
('Tưới cây tự động', 'Lắp đặt hệ thống tưới tự động thông minh', 300000, 'service-watering.jpg'),
('Thiết kế sân vườn', 'Thiết kế và cải tạo sân vườn theo phong cách hiện đại', 500000, 'service-landscape.jpg'),
('Chăm sóc cây trong nhà', 'Dịch vụ chăm sóc cây cảnh nội thất', 80000, 'service-indoor.jpg');

-- Chèn dữ liệu mẫu cho bảng users (mật khẩu đã hash)
-- Mật khẩu mẫu: 'password123' (đã hash với bcrypt)
INSERT INTO users (name, email, phone, password, role) VALUES
('Nguyễn Văn Admin', 'admin@gardencare.com', '0123456789', '$2a$10$example.hash.for.admin', 'admin'),
('Trần Thị User', 'user1@gardencare.com', '0987654321', '$2a$10$example.hash.for.user1', 'user'),
('Lê Văn User', 'user2@gardencare.com', '0912345678', '$2a$10$example.hash.for.user2', 'user');

-- Chèn dữ liệu mẫu cho bảng bookings
INSERT INTO bookings (user_id, service_id, booking_date, time_slot, address, status) VALUES
(2, 1, '2024-04-01', 'morning', '123 Đường ABC, Quận 1, TP.HCM', 'completed'),
(2, 3, '2024-04-05', 'afternoon', '456 Đường XYZ, Quận 2, TP.HCM', 'confirmed'),
(3, 2, '2024-04-10', 'afternoon', '789 Đường DEF, Quận 3, TP.HCM', 'pending'),
(3, 4, '2024-04-15', 'morning', '321 Đường GHI, Quận 4, TP.HCM', 'pending');

-- Chèn dữ liệu mẫu cho bảng booking_items (mỗi booking có thể nhiều dịch vụ)
INSERT INTO booking_items (booking_id, service_id, quantity, unit_price) VALUES
(1, 1, 1, 150000),
(2, 3, 1, 200000),
(3, 2, 1, 100000),
(4, 4, 1, 300000);

-- Chèn dữ liệu mẫu cho bảng contacts
INSERT INTO contacts (full_name, email, phone, subject, message, status) VALUES
('Nguyễn Minh Anh', 'minhanh@gmail.com', '0901234567', 'Tư vấn dịch vụ', 'Mình muốn tư vấn gói chăm sóc định kỳ cho sân vườn khoảng 120m2.', 'new'),
('Trần Đức Huy', 'huytran@gmail.com', '0912345678', 'Đặt lịch hẹn', 'Cho mình hỏi lịch trống cuối tuần này để xử lý sâu bệnh cho cây cảnh.', 'in_progress');