CREATE DATABASE IF NOT EXISTS garden_care CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE garden_care;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'staff', 'admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_role (role)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS services (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  plant_type VARCHAR(80) DEFAULT NULL,
  duration_minutes INT UNSIGNED DEFAULT 60,
  price DECIMAL(12,2) NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_services_price (price),
  KEY idx_services_plant_type (plant_type),
  KEY idx_services_active (is_active)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  service_id INT UNSIGNED NOT NULL,
  staff_id INT UNSIGNED DEFAULT NULL,
  booking_date DATE NOT NULL,
  time_slot ENUM('morning', 'afternoon', 'evening') NOT NULL,
  address VARCHAR(500) NOT NULL,
  note TEXT,
  status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  completion_note TEXT,
  before_image VARCHAR(255) DEFAULT NULL,
  after_image VARCHAR(255) DEFAULT NULL,
  payment_method ENUM('cod', 'bank') NOT NULL DEFAULT 'cod',
  payment_status ENUM('pending', 'paid', 'refunded') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_bookings_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_bookings_service FOREIGN KEY (service_id)
    REFERENCES services(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_bookings_staff FOREIGN KEY (staff_id)
    REFERENCES users(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  KEY idx_bookings_user_id (user_id),
  KEY idx_bookings_staff_id (staff_id),
  KEY idx_bookings_service_id (service_id),
  KEY idx_bookings_status (status),
  KEY idx_bookings_booking_date (booking_date),
  KEY idx_bookings_slot_conflict (service_id, booking_date, time_slot, status),
  KEY idx_bookings_staff_status (staff_id, status),
  KEY idx_bookings_payment_status (payment_status),
  KEY idx_bookings_created_at (created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  service_id INT UNSIGNED NOT NULL,
  booking_id INT UNSIGNED DEFAULT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT,
  is_visible TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_reviews_rating CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT fk_reviews_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_service FOREIGN KEY (service_id)
    REFERENCES services(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id)
    REFERENCES bookings(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE KEY uq_reviews_user_booking (user_id, booking_id),
  KEY idx_reviews_service_id (service_id),
  KEY idx_reviews_user_id (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  method ENUM('cod', 'bank') NOT NULL DEFAULT 'cod',
  status ENUM('pending', 'paid', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  provider VARCHAR(40) DEFAULT NULL,
  transaction_ref VARCHAR(100) DEFAULT NULL,
  paid_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id)
    REFERENCES bookings(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_payments_booking (booking_id),
  KEY idx_payments_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  booking_id INT UNSIGNED DEFAULT NULL,
  message VARCHAR(500) NOT NULL,
  type ENUM('booking', 'payment', 'system') NOT NULL DEFAULT 'booking',
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_notifications_booking FOREIGN KEY (booking_id)
    REFERENCES bookings(id)
    ON DELETE SET NULL ON UPDATE CASCADE,
  KEY idx_notifications_user_read (user_id, is_read),
  KEY idx_notifications_created_at (created_at)
) ENGINE=InnoDB;
