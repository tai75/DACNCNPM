-- Cải tiến bảng bookings để hỗ trợ payment system
-- Thêm cột payment_method và payment_status

ALTER TABLE bookings
ADD COLUMN payment_method ENUM('cod', 'bank') DEFAULT 'cod' AFTER address,
ADD COLUMN payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending' AFTER payment_method;

-- Cập nhật các booking cũ (nếu có) mặc định là COD
<<<<<<< HEAD
UPDATE bookings SET payment_method = 'cod', payment_status = 'pending' WHERE payment_method IS NULL;

-- Bo sung index toi uu truy van bookings/reviews
ALTER TABLE bookings
ADD INDEX idx_bookings_slot_conflict (service_id, booking_date, time_slot, status),
ADD INDEX idx_bookings_staff_status (staff_id, status),
ADD INDEX idx_bookings_payment_status (payment_status),
ADD INDEX idx_bookings_created_at (created_at);

ALTER TABLE reviews
ADD INDEX idx_reviews_user_id (user_id);
=======
UPDATE bookings SET payment_method = 'cod', payment_status = 'pending' WHERE payment_method IS NULL;
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577
