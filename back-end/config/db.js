<<<<<<< HEAD
require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
=======
require("dotenv").config();
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const isTestEnv = process.env.NODE_ENV === "test" || Boolean(process.env.JEST_WORKER_ID);

if (!isTestEnv) {
  db.connect((err) => {
    if (err) {
      console.log("❌ Lỗi kết nối DB:", err);
    } else {
      console.log("✅ Kết nối MySQL thành công");
    }
  });
}

module.exports = db;