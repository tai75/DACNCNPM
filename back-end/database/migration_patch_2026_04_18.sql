USE garden_care;

-- Add a staff-visible "not completed" booking status so unfinished work can wait for admin rescheduling.
ALTER TABLE bookings
  MODIFY status ENUM('pending', 'confirmed', 'in_progress', 'not_completed', 'completed', 'cancelled') NOT NULL DEFAULT 'pending';