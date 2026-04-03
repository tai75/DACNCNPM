-- Cải tiến bảng bookings để hỗ trợ payment system
-- Thêm cột payment_method và payment_status

ALTER TABLE bookings
ADD COLUMN payment_method ENUM('cod', 'bank') DEFAULT 'cod' AFTER address,
ADD COLUMN payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending' AFTER payment_method;

-- Cập nhật các booking cũ (nếu có) mặc định là COD
UPDATE bookings SET payment_method = 'cod', payment_status = 'pending' WHERE payment_method IS NULL;