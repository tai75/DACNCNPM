USE garden_care;

-- Normalize existing evening bookings to afternoon before narrowing the enum.
UPDATE bookings
SET time_slot = 'afternoon'
WHERE time_slot = 'evening';

-- Narrow the booking time slot enum to morning/afternoon only.
ALTER TABLE bookings
  MODIFY time_slot ENUM('morning', 'afternoon') NOT NULL;