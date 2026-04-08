const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const definitions = [
  {
    table: "bookings",
    name: "idx_bookings_slot_conflict",
    ddl: "ALTER TABLE bookings ADD INDEX idx_bookings_slot_conflict (service_id, booking_date, time_slot, status)",
  },
  {
    table: "bookings",
    name: "idx_bookings_staff_status",
    ddl: "ALTER TABLE bookings ADD INDEX idx_bookings_staff_status (staff_id, status)",
  },
  {
    table: "bookings",
    name: "idx_bookings_payment_status",
    ddl: "ALTER TABLE bookings ADD INDEX idx_bookings_payment_status (payment_status)",
  },
  {
    table: "bookings",
    name: "idx_bookings_created_at",
    ddl: "ALTER TABLE bookings ADD INDEX idx_bookings_created_at (created_at)",
  },
  {
    table: "reviews",
    name: "idx_reviews_user_id",
    ddl: "ALTER TABLE reviews ADD INDEX idx_reviews_user_id (user_id)",
  },
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    for (const item of definitions) {
      const [rows] = await connection.query(
        `SELECT 1
         FROM information_schema.statistics
         WHERE table_schema = DATABASE()
           AND table_name = ?
           AND index_name = ?
         LIMIT 1`,
        [item.table, item.name]
      );

      if (rows.length > 0) {
        console.log(`exists ${item.name}`);
        continue;
      }

      await connection.query(item.ddl);
      console.log(`created ${item.name}`);
    }

    const [bookingIndexes] = await connection.query(
      "SHOW INDEX FROM bookings WHERE Key_name IN ('idx_bookings_slot_conflict','idx_bookings_staff_status','idx_bookings_payment_status','idx_bookings_created_at')"
    );
    const [reviewIndexes] = await connection.query(
      "SHOW INDEX FROM reviews WHERE Key_name = 'idx_reviews_user_id'"
    );

    console.log(`verify_bookings_rows ${bookingIndexes.length}`);
    console.log(`verify_reviews_rows ${reviewIndexes.length}`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(`migration-error ${error.message}`);
  process.exit(1);
});
