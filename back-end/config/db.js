const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "hiamtaismile", // đổi theo máy 
  database: "garden_care",
});

db.connect((err) => {
  if (err) {
    console.log("❌ Lỗi kết nối DB:", err);
  } else {
    console.log("✅ Kết nối MySQL thành công");
  }
});

module.exports = db;