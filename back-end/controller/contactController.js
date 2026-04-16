const db = require("../config/db");
const Joi = require("joi");

const createContactSchema = Joi.object({
  full_name: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().max(191).allow("", null),
  phone: Joi.string().trim().max(20).allow("", null),
  subject: Joi.string().trim().max(150).allow("", null),
  message: Joi.string().trim().min(10).max(2000).required(),
});

const listContactsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid("new", "in_progress", "resolved").allow("", null),
  q: Joi.string().trim().max(200).allow("", null),
});

const contactIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const updateContactStatusSchema = Joi.object({
  status: Joi.string().valid("new", "in_progress", "resolved").required(),
});

const ensureContactsTable = (callback) => {
  const sql = `
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
    ) ENGINE=InnoDB
  `;

  db.query(sql, (err) => {
    if (err) return callback(err);
    return callback(null);
  });
};

exports.createContact = (req, res) => {
  const { error, value } = createContactSchema.validate(req.body || {});
  if (error) {
    return res.status(400).json({
      success: false,
      message: `Du lieu khong hop le: ${error.details[0].message}`,
    });
  }

  ensureContactsTable((tableErr) => {
    if (tableErr) {
      console.error("Ensure contacts table error:", tableErr);
      return res.status(500).json({ success: false, message: "Loi may chu" });
    }

    const sql = `
      INSERT INTO contacts (full_name, email, phone, subject, message, status)
      VALUES (?, ?, ?, ?, ?, 'new')
    `;

    db.query(
      sql,
      [
        value.full_name,
        value.email || null,
        value.phone || null,
        value.subject || null,
        value.message,
      ],
      (insertErr, result) => {
        if (insertErr) {
          console.error("Create contact error:", insertErr);
          return res.status(500).json({ success: false, message: "Loi may chu" });
        }

        return res.status(201).json({
          success: true,
          message: "Gui lien he thanh cong",
          contact_id: result.insertId,
        });
      }
    );
  });
};

exports.getContacts = (req, res) => {
  const { error, value } = listContactsQuerySchema.validate(req.query || {});
  if (error) {
    return res.status(400).json({ success: false, message: "Query khong hop le" });
  }

  ensureContactsTable((tableErr) => {
    if (tableErr) {
      console.error("Ensure contacts table error:", tableErr);
      return res.status(500).json({ success: false, message: "Loi may chu" });
    }

    const { page, limit, status, q } = value;
    const offset = (page - 1) * limit;

    let whereSql = " WHERE 1=1";
    const whereParams = [];

    if (status) {
      whereSql += " AND status = ?";
      whereParams.push(status);
    }

    if (q) {
      whereSql += " AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR message LIKE ?)";
      const keyword = `%${q}%`;
      whereParams.push(keyword, keyword, keyword, keyword, keyword);
    }

    const countSql = `SELECT COUNT(*) AS total FROM contacts ${whereSql}`;
    const listSql = `
      SELECT id, full_name, email, phone, subject, message, status, created_at, updated_at
      FROM contacts
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;

    db.query(countSql, whereParams, (countErr, countRows) => {
      if (countErr) {
        console.error("Count contacts error:", countErr);
        return res.status(500).json({ success: false, message: "Loi may chu" });
      }

      const total = Number(countRows[0]?.total || 0);
      const totalPages = Math.ceil(total / limit) || 1;

      db.query(listSql, [...whereParams, limit, offset], (listErr, rows) => {
        if (listErr) {
          console.error("List contacts error:", listErr);
          return res.status(500).json({ success: false, message: "Loi may chu" });
        }

        return res.json({
          success: true,
          data: rows,
          pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
          },
        });
      });
    });
  });
};

exports.updateContactStatus = (req, res) => {
  const idValidation = contactIdSchema.validate(req.params || {});
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID lien he khong hop le" });
  }

  const statusValidation = updateContactStatusSchema.validate(req.body || {});
  if (statusValidation.error) {
    return res.status(400).json({ success: false, message: "Trang thai khong hop le" });
  }

  ensureContactsTable((tableErr) => {
    if (tableErr) {
      console.error("Ensure contacts table error:", tableErr);
      return res.status(500).json({ success: false, message: "Loi may chu" });
    }

    const sql = "UPDATE contacts SET status = ? WHERE id = ?";
    db.query(sql, [statusValidation.value.status, idValidation.value.id], (err, result) => {
      if (err) {
        console.error("Update contact status error:", err);
        return res.status(500).json({ success: false, message: "Loi may chu" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Lien he khong ton tai" });
      }

      return res.json({ success: true, message: "Cap nhat trang thai thanh cong" });
    });
  });
};

exports.deleteContact = (req, res) => {
  const idValidation = contactIdSchema.validate(req.params || {});
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID lien he khong hop le" });
  }

  ensureContactsTable((tableErr) => {
    if (tableErr) {
      console.error("Ensure contacts table error:", tableErr);
      return res.status(500).json({ success: false, message: "Loi may chu" });
    }

    db.query("DELETE FROM contacts WHERE id = ?", [idValidation.value.id], (err, result) => {
      if (err) {
        console.error("Delete contact error:", err);
        return res.status(500).json({ success: false, message: "Loi may chu" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Lien he khong ton tai" });
      }

      return res.json({ success: true, message: "Xoa lien he thanh cong" });
    });
  });
};
