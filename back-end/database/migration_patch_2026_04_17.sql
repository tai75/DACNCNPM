USE garden_care;

-- Add status column to booking_items to track individual item cancellations.
-- This allows users to cancel individual services within a booking instead of cancelling the entire booking.
ALTER TABLE booking_items
ADD COLUMN status ENUM('active', 'cancelled') NOT NULL DEFAULT 'active' AFTER unit_price;

-- Create index for faster queries on item status
CREATE INDEX idx_booking_items_status ON booking_items(status);
