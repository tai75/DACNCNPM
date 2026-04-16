USE garden_care;

-- 1) Add missing column used by staff assignment logic
SET @has_secondary_staff_col := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'bookings'
    AND COLUMN_NAME = 'secondary_staff_id'
);

SET @sql_add_secondary_staff_col := IF(
  @has_secondary_staff_col = 0,
  'ALTER TABLE bookings ADD COLUMN secondary_staff_id INT UNSIGNED NULL AFTER staff_id',
  'SELECT 1'
);
PREPARE stmt_add_secondary_staff_col FROM @sql_add_secondary_staff_col;
EXECUTE stmt_add_secondary_staff_col;
DEALLOCATE PREPARE stmt_add_secondary_staff_col;

SET @has_secondary_staff_fk := (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'bookings'
    AND CONSTRAINT_NAME = 'fk_bookings_secondary_staff'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY'
);

SET @sql_add_secondary_staff_fk := IF(
  @has_secondary_staff_fk = 0,
  'ALTER TABLE bookings ADD CONSTRAINT fk_bookings_secondary_staff FOREIGN KEY (secondary_staff_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE',
  'SELECT 1'
);
PREPARE stmt_add_secondary_staff_fk FROM @sql_add_secondary_staff_fk;
EXECUTE stmt_add_secondary_staff_fk;
DEALLOCATE PREPARE stmt_add_secondary_staff_fk;

SET @has_secondary_staff_idx := (
  SELECT COUNT(*)
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'bookings'
    AND INDEX_NAME = 'idx_bookings_secondary_staff_id'
);

SET @sql_add_secondary_staff_idx := IF(
  @has_secondary_staff_idx = 0,
  'CREATE INDEX idx_bookings_secondary_staff_id ON bookings (secondary_staff_id)',
  'SELECT 1'
);
PREPARE stmt_add_secondary_staff_idx FROM @sql_add_secondary_staff_idx;
EXECUTE stmt_add_secondary_staff_idx;
DEALLOCATE PREPARE stmt_add_secondary_staff_idx;

-- 2) Add booking_items for multi-service booking
CREATE TABLE IF NOT EXISTS booking_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  service_id INT UNSIGNED NOT NULL,
  quantity INT UNSIGNED NOT NULL DEFAULT 1,
  unit_price DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_items_booking FOREIGN KEY (booking_id)
    REFERENCES bookings(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_booking_items_service FOREIGN KEY (service_id)
    REFERENCES services(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  UNIQUE KEY uq_booking_service (booking_id, service_id),
  KEY idx_booking_items_booking_id (booking_id),
  KEY idx_booking_items_service_id (service_id)
) ENGINE=InnoDB;

-- 3) Add many-to-many staff assignments for one booking
CREATE TABLE IF NOT EXISTS booking_staff_assignments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_id INT UNSIGNED NOT NULL,
  staff_id INT UNSIGNED NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_booking_staff_assignments_booking FOREIGN KEY (booking_id)
    REFERENCES bookings(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_booking_staff_assignments_staff FOREIGN KEY (staff_id)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uq_booking_staff (booking_id, staff_id),
  KEY idx_booking_staff_assignments_booking_id (booking_id),
  KEY idx_booking_staff_assignments_staff_id (staff_id)
) ENGINE=InnoDB;

-- Backfill from legacy staff columns if they already exist
INSERT IGNORE INTO booking_staff_assignments (booking_id, staff_id)
SELECT id, staff_id FROM bookings WHERE staff_id IS NOT NULL;

INSERT IGNORE INTO booking_staff_assignments (booking_id, staff_id)
SELECT id, secondary_staff_id FROM bookings WHERE secondary_staff_id IS NOT NULL;

-- 4) Backfill booking_items from existing single-service bookings
INSERT INTO booking_items (booking_id, service_id, quantity, unit_price)
SELECT b.id, b.service_id, 1, s.price
FROM bookings b
JOIN services s ON s.id = b.service_id
LEFT JOIN booking_items bi ON bi.booking_id = b.id AND bi.service_id = b.service_id
WHERE b.service_id IS NOT NULL
  AND bi.id IS NULL;

-- 5) Add contacts table for contact form + admin management
CREATE TABLE IF NOT EXISTS contacts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(191) DEFAULT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  subject VARCHAR(150) DEFAULT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'in_progress', 'resolved') NOT NULL DEFAULT 'new',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_contacts_status (status),
  KEY idx_contacts_created_at (created_at)
) ENGINE=InnoDB;

-- 6) Add review visibility column if missing
SET @has_reviews_visible_col := (
  SELECT COUNT(*)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'reviews'
    AND COLUMN_NAME = 'is_visible'
);

SET @sql_add_reviews_visible_col := IF(
  @has_reviews_visible_col = 0,
  'ALTER TABLE reviews ADD COLUMN is_visible TINYINT(1) NOT NULL DEFAULT 1',
  'SELECT 1'
);
PREPARE stmt_add_reviews_visible_col FROM @sql_add_reviews_visible_col;
EXECUTE stmt_add_reviews_visible_col;
DEALLOCATE PREPARE stmt_add_reviews_visible_col;
