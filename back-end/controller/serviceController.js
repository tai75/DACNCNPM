const db = require("../config/db");

exports.getAll = (req, res) => {
  db.query("SELECT * FROM services", (err, result) => {
    if (err) return res.status(500).json({ message: "Lỗi server" });
    res.json(result);
  });
};

exports.getOne = (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM services WHERE id = ?", [id], (err, result) => {
    res.json(result[0]);
  });
};

exports.create = (req, res) => {
  const { name, description, image, price } = req.body;

  db.query(
    "INSERT INTO services (name, description, image, price) VALUES (?, ?, ?, ?)",
    [name, description, image, price],
    (err) => {
      res.json({ message: "Thêm thành công" });
    }
  );
};

exports.update = (req, res) => {
  const { id } = req.params;
  const { name, description, image, price } = req.body;

  db.query(
    "UPDATE services SET name=?, description=?, image=?, price=? WHERE id=?",
    [name, description, image, price, id],
    () => {
      res.json({ message: "Cập nhật thành công" });
    }
  );
};

exports.remove = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM services WHERE id = ?", [id], () => {
    res.json({ message: "Xóa thành công" });
  });
};