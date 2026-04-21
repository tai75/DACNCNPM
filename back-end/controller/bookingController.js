const db = require("../config/db");
const Joi = require("joi");

const bookingSchema = Joi.object({
  service_id: Joi.number().integer().positive(),
  service_ids: Joi.array().items(Joi.number().integer().positive()).min(1).max(20).unique(),
  booking_date: Joi.date().greater("now").required(),
  time_slot: Joi.string().valid("morning", "afternoon").required(),
  address: Joi.string().min(10).max(500).required(),
  note: Joi.string().allow("", null).max(1000),
  payment_method: Joi.string().valid("cod", "bank").default("cod"),
}).or("service_id", "service_ids");

const statusSchema = Joi.object({
  status: Joi.string()
    .valid("pending", "confirmed", "in_progress", "completed", "cancelled")
    .required(),
});

const paymentStatusSchema = Joi.object({
  payment_status: Joi.string().valid("pending", "paid", "refunded").required(),
});

const bookingIdSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
});

const assignStaffSchema = Joi.object({
  staff_ids: Joi.array().items(Joi.number().integer().positive()).min(1).max(20).unique().required(),
});

const completionSchema = Joi.object({
  completion_note: Joi.string().allow("", null).max(2000),
  before_image: Joi.string().allow("", null).max(255),
  after_image: Joi.string().allow("", null).max(255),
  status: Joi.string().valid("in_progress", "completed").default("completed"),
});

const scheduleSchema = Joi.object({
  booking_date: Joi.date().required(),
  time_slot: Joi.string().valid("morning", "afternoon").required(),
});

const bookingsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

const statusTranslations = {
  pending: "Cho xac nhan",
  confirmed: "Da xac nhan",
  in_progress: "Dang thuc hien",
  completed: "Hoan thanh",
  cancelled: "Da huy",
};

const paymentMethodTranslations = {
  cod: "Thanh toan khi hoan thanh",
  bank: "Chuyen khoan ngan hang",
};

const paymentStatusTranslations = {
  pending: "Chua thanh toan",
  paid: "Da thanh toan",
  refunded: "Da hoan tien",
};

const allowedTransitionsByStaff = {
  pending: [],
  confirmed: ["in_progress"],
  in_progress: ["completed"],
  completed: [],
  cancelled: [],
};

const autoRescheduleOverdueBookings = (callback) => {
  const sql = `
    UPDATE bookings
    SET booking_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
    WHERE booking_date < CURDATE()
      AND status IN ('pending', 'confirmed', 'in_progress')
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return callback(err);
    }

    if (result && result.affectedRows > 0) {
      console.log(`[booking] Auto-rescheduled ${result.affectedRows} overdue booking(s) to next day`);
    }

    return callback(null);
  });
};

const createNotification = (userId, message, bookingId = null) => {
  const sql = `
    INSERT INTO notifications (user_id, booking_id, message, type, is_read)
    VALUES (?, ?, ?, 'booking', 0)
  `;

  db.query(sql, [userId, bookingId, message], () => {
    // Best-effort notification, ignore write errors to avoid blocking main flow.
  });
};

const checkStaffAvailability = (staffId, bookingDate, timeSlot, excludeBookingId = null, callback) => {
  // Check if staff has conflicting bookings on the same date and time slot
  let sql = `
    SELECT COUNT(*) as conflict_count
    FROM bookings b
    JOIN booking_staff_assignments bsa ON bsa.booking_id = b.id
    WHERE bsa.staff_id = ?
      AND DATE(b.booking_date) = DATE(?)
      AND b.time_slot = ?
      AND b.status IN ('confirmed', 'in_progress', 'completed')
  `;
  
  const params = [staffId, bookingDate, timeSlot];
  
  if (excludeBookingId) {
    sql += " AND b.id != ?";
    params.push(excludeBookingId);
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      return callback(err);
    }

    const isAvailable = result[0].conflict_count === 0;
    return callback(null, isAvailable);
  });
};

const ensureSecondaryStaffColumn = (callback) => {
  db.query("SHOW COLUMNS FROM bookings LIKE 'secondary_staff_id'", (checkErr, rows) => {
    if (checkErr) {
      return callback(checkErr);
    }

    if (rows.length > 0) {
      return callback(null);
    }

    db.query("ALTER TABLE bookings ADD COLUMN secondary_staff_id INT UNSIGNED NULL AFTER staff_id", (alterErr) => {
      if (alterErr) {
        return callback(alterErr);
      }

      db.query("CREATE INDEX idx_bookings_secondary_staff_id ON bookings (secondary_staff_id)", (indexErr) => {
        if (indexErr && indexErr.code !== "ER_DUP_KEYNAME") {
          return callback(indexErr);
        }
        return callback(null);
      });
    });
  });
};

const ensureBookingStaffAssignmentsTable = (callback) => {
  const createTableSql = `
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
    ) ENGINE=InnoDB
  `;

  db.query(createTableSql, (createErr) => {
    if (createErr) {
      return callback(createErr);
    }

    const backfillPrimarySql = `
      INSERT IGNORE INTO booking_staff_assignments (booking_id, staff_id)
      SELECT id, staff_id
      FROM bookings
      WHERE staff_id IS NOT NULL
    `;

    db.query(backfillPrimarySql, (primaryErr) => {
      if (primaryErr) {
        return callback(primaryErr);
      }

      const backfillSecondarySql = `
        INSERT IGNORE INTO booking_staff_assignments (booking_id, staff_id)
        SELECT id, secondary_staff_id
        FROM bookings
        WHERE secondary_staff_id IS NOT NULL
      `;

      db.query(backfillSecondarySql, (secondaryErr) => {
        if (secondaryErr) {
          return callback(secondaryErr);
        }

        return callback(null);
      });
    });
  });
};

const ensureBookingItemsTable = (callback) => {
  const createTableSql = `
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
    ) ENGINE=InnoDB
  `;

  db.query(createTableSql, (createErr) => {
    if (createErr) {
      return callback(createErr);
    }

    return callback(null);
  });
};

exports.getBookings = (req, res) => {
  const { error, value } = bookingsQuerySchema.validate(req.query);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Query khong hop le",
    });
  }

  const { page, limit } = value;
  const offset = (page - 1) * limit;

  autoRescheduleOverdueBookings((rescheduleErr) => {
    if (rescheduleErr) {
      console.error("Auto reschedule overdue bookings error:", rescheduleErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

  ensureSecondaryStaffColumn((columnErr) => {
    if (columnErr) {
      console.error("Ensure secondary_staff_id error:", columnErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    ensureBookingStaffAssignmentsTable((staffTableErr) => {
      if (staffTableErr) {
        console.error("Ensure booking_staff_assignments table error:", staffTableErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      ensureBookingItemsTable((tableErr) => {
      if (tableErr) {
        console.error("Ensure booking_items table error:", tableErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      let sql = `
        SELECT
          b.id,
          b.service_id,
          b.booking_date,
          b.time_slot,
          b.address,
          b.note,
          b.status,
          b.payment_method,
          b.payment_status,
          b.completion_note,
          b.before_image,
          b.after_image,
          b.created_at,
          u.name AS user_name,
          GROUP_CONCAT(DISTINCT bsa.staff_id ORDER BY bsa.staff_id SEPARATOR ',') AS staff_ids,
          COALESCE(NULLIF(GROUP_CONCAT(DISTINCT st.name ORDER BY st.name SEPARATOR ', '), ''), '') AS staff_name,
          COALESCE(NULLIF(GROUP_CONCAT(DISTINCT si.name ORDER BY si.id SEPARATOR ', '), ''), s.name) AS service_name,
          COALESCE(NULLIF(MAX(si.image), ''), s.image) AS service_image,
          COALESCE(SUM(bi.quantity * bi.unit_price), s.price) AS service_price
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN services s ON b.service_id = s.id
        LEFT JOIN booking_staff_assignments bsa ON bsa.booking_id = b.id
        LEFT JOIN users st ON st.id = bsa.staff_id
        LEFT JOIN booking_items bi ON bi.booking_id = b.id
        LEFT JOIN services si ON si.id = bi.service_id
      `;

      let countSql = "SELECT COUNT(*) AS total FROM bookings b";
      const params = [];
      const countParams = [];

      if (req.user.role === "staff") {
        sql += " WHERE EXISTS (SELECT 1 FROM booking_staff_assignments bsa2 WHERE bsa2.booking_id = b.id AND bsa2.staff_id = ?)";
        countSql += " WHERE EXISTS (SELECT 1 FROM booking_staff_assignments bsa2 WHERE bsa2.booking_id = b.id AND bsa2.staff_id = ?)";
        params.push(req.user.id);
        countParams.push(req.user.id);
      } else if (req.user.role !== "admin") {
        sql += " WHERE b.user_id = ?";
        countSql += " WHERE b.user_id = ?";
        params.push(req.user.id);
        countParams.push(req.user.id);
      }

      sql += " GROUP BY b.id ORDER BY b.created_at DESC LIMIT ? OFFSET ?";
      params.push(limit, offset);

      db.query(countSql, countParams, (countErr, countResult) => {
        if (countErr) {
          console.error("Count bookings error:", countErr);
          return res.status(500).json({ success: false, message: "Loi server" });
        }

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        db.query(sql, params, (listErr, result) => {
          if (listErr) {
            console.error("Get bookings error:", listErr);
            return res.status(500).json({ success: false, message: "Loi server" });
          }

          const bookingIds = result.map((booking) => booking.id);
          if (bookingIds.length === 0) {
            return res.json({
              success: true,
              data: [],
              pagination: {
                currentPage: page,
                totalPages,
                totalItems: total,
                itemsPerPage: limit,
              },
            });
          }

          const placeholders = bookingIds.map(() => "?").join(", ");
          const itemsSql = `
            SELECT
              bi.booking_id,
              bi.service_id,
              bi.quantity,
              bi.unit_price,
              s.name AS service_name,
              s.image AS service_image
            FROM booking_items bi
            JOIN services s ON s.id = bi.service_id
            WHERE bi.booking_id IN (${placeholders})
            ORDER BY bi.id ASC
          `;

          db.query(itemsSql, bookingIds, (itemsErr, itemsRows) => {
            if (itemsErr) {
              console.error("Get booking items error:", itemsErr);
              return res.status(500).json({ success: false, message: "Loi server" });
            }

            const itemsByBookingId = itemsRows.reduce((acc, row) => {
              if (!acc[row.booking_id]) {
                acc[row.booking_id] = [];
              }

              acc[row.booking_id].push({
                service_id: row.service_id,
                service_name: row.service_name,
                service_image: row.service_image,
                quantity: Number(row.quantity || 1),
                unit_price: Number(row.unit_price || 0),
              });

              return acc;
            }, {});

            return res.json({
              success: true,
              data: result.map((booking) => {
                const serviceItems =
                  itemsByBookingId[booking.id] && itemsByBookingId[booking.id].length > 0
                    ? itemsByBookingId[booking.id]
                    : [
                        {
                          service_id: booking.service_id,
                          service_name: booking.service_name,
                          service_image: booking.service_image,
                          quantity: 1,
                          unit_price: Number(booking.service_price || 0),
                        },
                      ];

                return {
                  ...booking,
                  service_price: Number(booking.service_price || 0),
                  service_items: serviceItems,
                  service_ids: serviceItems.map((item) => item.service_id),
                  staff_ids: booking.staff_ids
                    ? String(booking.staff_ids)
                        .split(",")
                        .map((id) => Number(id))
                        .filter((id) => Number.isInteger(id) && id > 0)
                    : [],
                  staff_names: booking.staff_name
                    ? String(booking.staff_name)
                        .split(",")
                        .map((name) => name.trim())
                        .filter(Boolean)
                    : [],
                  status_vietnamese: statusTranslations[booking.status] || booking.status,
                  payment_method_vietnamese:
                    paymentMethodTranslations[booking.payment_method] || booking.payment_method,
                  payment_status_vietnamese:
                    paymentStatusTranslations[booking.payment_status] || booking.payment_status,
                };
              }),
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
      });
    });
  });
  });
};

exports.createBooking = (req, res) => {
  const { error, value } = bookingSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: "Du lieu khong hop le: " + error.details[0].message,
    });
  }

  const { service_id, service_ids, booking_date, time_slot, address, note, payment_method } = value;

  const normalizedServiceIds =
    Array.isArray(service_ids) && service_ids.length > 0
      ? [...new Set(service_ids.map((id) => Number(id)).filter(Boolean))]
      : [Number(service_id)].filter(Boolean);

  if (normalizedServiceIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Can it nhat 1 dich vu de dat lich",
    });
  }

  ensureBookingItemsTable((tableErr) => {
    if (tableErr) {
      console.error("Ensure booking_items table error:", tableErr);
      return res.status(500).json({ success: false, message: "Loi may chu" });
    }

    const placeholders = normalizedServiceIds.map(() => "?").join(", ");
    const servicesSql = `SELECT id, name, price FROM services WHERE id IN (${placeholders})`;

    db.query(servicesSql, normalizedServiceIds, (servicesErr, servicesRows) => {
      if (servicesErr) {
        console.error("Validate services error:", servicesErr);
        return res.status(500).json({ success: false, message: "Loi may chu" });
      }

      if (servicesRows.length !== normalizedServiceIds.length) {
        return res.status(400).json({
          success: false,
          message: "Co dich vu khong ton tai hoac da ngung hoat dong",
        });
      }

      const serviceById = servicesRows.reduce((acc, row) => {
        acc[row.id] = row;
        return acc;
      }, {});

      const checkConflictSql = `
        SELECT id
        FROM bookings
        WHERE user_id = ?
          AND DATE(booking_date) = DATE(?)
          AND time_slot = ?
          AND status IN ('pending', 'confirmed', 'in_progress')
        LIMIT 1
      `;

      db.query(checkConflictSql, [req.user.id, booking_date, time_slot], (checkErr, checkRows) => {
        if (checkErr) {
          console.error("Check conflict error:", checkErr);
          return res.status(500).json({ success: false, message: "Loi may chu" });
        }

        if (checkRows.length > 0) {
          return res.status(409).json({
            success: false,
            message: "Ban da co lich hen trong khung gio nay. Vui long chon khung gio khac",
          });
        }

        db.beginTransaction((txStartErr) => {
          if (txStartErr) {
            console.error("Begin transaction create booking error:", txStartErr);
            return res.status(500).json({ success: false, message: "Loi may chu" });
          }

          const primaryServiceId = normalizedServiceIds[0];
          const serviceNames = normalizedServiceIds.map((id) => serviceById[id]?.name).filter(Boolean);
          const generatedMultiServiceNote =
            normalizedServiceIds.length > 1
              ? `Dich vu trong don: ${serviceNames.join(", ")}`
              : null;

          const insertSql = `
            INSERT INTO bookings
            (user_id, service_id, booking_date, time_slot, address, note, payment_method, payment_status, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
          `;

          db.query(
            insertSql,
            [
              req.user.id,
              primaryServiceId,
              booking_date,
              time_slot,
              address,
              note || generatedMultiServiceNote,
              payment_method,
            ],
            (insertErr, result) => {
              if (insertErr) {
                return db.rollback(() => {
                  console.error("Create booking error:", insertErr);
                  return res.status(500).json({ success: false, message: "Loi may chu" });
                });
              }

              const bookingId = result.insertId;
              const bookingItemValues = normalizedServiceIds.map((serviceIdItem) => [
                bookingId,
                serviceIdItem,
                1,
                Number(serviceById[serviceIdItem]?.price || 0),
              ]);

              const bookingItemsSql = `
                INSERT INTO booking_items (booking_id, service_id, quantity, unit_price)
                VALUES ?
              `;

              db.query(bookingItemsSql, [bookingItemValues], (itemsErr) => {
                if (itemsErr) {
                  return db.rollback(() => {
                    console.error("Create booking items error:", itemsErr);
                    return res.status(500).json({ success: false, message: "Loi may chu" });
                  });
                }

                return db.commit((commitErr) => {
                  if (commitErr) {
                    return db.rollback(() => {
                      console.error("Commit create booking error:", commitErr);
                      return res.status(500).json({ success: false, message: "Loi may chu" });
                    });
                  }

                  createNotification(
                    req.user.id,
                    "Booking moi da duoc tao va dang cho xac nhan",
                    bookingId
                  );

                  return res.json({
                    success: true,
                    message: "Dat lich thanh cong",
                    booking_id: bookingId,
                  });
                });
              });
            }
          );
        });
      });
    });
  });
};

exports.updatePaymentStatus = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      success: false,
      message: "Chi admin hoac staff moi co the cap nhat trang thai thanh toan",
    });
  }

  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const bodyValidation = paymentStatusSchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({
      success: false,
      message: "Du lieu khong hop le: " + bodyValidation.error.details[0].message,
    });
  }

  const { id } = idValidation.value;
  const { payment_status } = bodyValidation.value;

  ensureBookingStaffAssignmentsTable((staffTableErr) => {
    if (staffTableErr) {
      console.error("Ensure booking_staff_assignments error:", staffTableErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    db.query(
      "SELECT id, user_id, status, payment_method, payment_status FROM bookings WHERE id = ?",
      [id],
      (findErr, rows) => {
        if (findErr) {
          console.error("Find booking for payment update error:", findErr);
          return res.status(500).json({ success: false, message: "Loi server" });
        }

        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: "Don dat lich khong ton tai" });
        }

        const booking = rows[0];

        if (payment_status === "refunded") {
          if (booking.payment_method !== "bank") {
            return res.status(400).json({
              success: false,
              message: "Chi co the hoan tien cho don thanh toan qua ngan hang",
            });
          }

          if (booking.status !== "cancelled") {
            return res.status(400).json({
              success: false,
              message: "Chi co the hoan tien cho don da duoc huy",
            });
          }
        }

        const applyUpdate = () => {
          const sql = `
            UPDATE bookings
            SET payment_status = ?
            WHERE id = ?
          `;

          db.query(sql, [payment_status, id], (updateErr) => {
            if (updateErr) {
              console.error("Update payment status error:", updateErr);
              return res.status(500).json({ success: false, message: "Loi server" });
            }

            if (payment_status === "refunded") {
              createNotification(booking.user_id, `Booking #${id} da duoc hoan tien`, id);
            }

            return res.json({ success: true, message: "Cap nhat trang thai thanh toan thanh cong" });
          });
        };

        if (req.user.role === "staff") {
          if (booking.payment_method === "bank") {
            return res.status(400).json({
              success: false,
              message: "Booking thanh toan ngan hang khong can staff cap nhat trang thai thanh toan",
            });
          }

          if (booking.status !== "completed") {
            return res.status(400).json({
              success: false,
              message: "Chi duoc cap nhat thanh toan khi booking da hoan thanh",
            });
          }

          if (payment_status !== "paid") {
            return res.status(400).json({
              success: false,
              message: "Staff chi duoc xac nhan da thanh toan cho booking sau hoan thanh",
            });
          }

          return db.query(
            "SELECT 1 FROM booking_staff_assignments WHERE booking_id = ? AND staff_id = ? LIMIT 1",
            [id, req.user.id],
            (assignmentErr, assignmentRows) => {
              if (assignmentErr) {
                console.error("Check booking assignment error:", assignmentErr);
                return res.status(500).json({ success: false, message: "Loi server" });
              }

              if (assignmentRows.length === 0) {
                return res.status(403).json({ success: false, message: "Booking khong thuoc pham vi cua ban" });
              }

              return applyUpdate();
            }
          );
        }

        return applyUpdate();
      }
    );
  });
};

exports.confirmBankPaymentByUser = (req, res) => {
  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const { id } = idValidation.value;

  const findSql = "SELECT id, user_id, payment_method, payment_status FROM bookings WHERE id = ?";
  db.query(findSql, [id], (findErr, rows) => {
    if (findErr) {
      console.error("Find booking for bank confirm error:", findErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Don dat lich khong ton tai" });
    }

    const booking = rows[0];

    if (booking.user_id !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Ban khong co quyen cap nhat don nay" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Don dat lich nay da bi huy" });
    }

    if (booking.payment_method !== "bank") {
      return res.status(400).json({ success: false, message: "Don dat lich nay khong su dung thanh toan ngan hang" });
    }

    if (booking.payment_status === "paid") {
      return res.json({ success: true, message: "Thanh toan da duoc xac nhan truoc do" });
    }

    const updateSql = "UPDATE bookings SET payment_status = 'paid' WHERE id = ?";
    db.query(updateSql, [id], (updateErr) => {
      if (updateErr) {
        console.error("Confirm bank payment error:", updateErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      createNotification(booking.user_id, `Booking #${id} da xac nhan thanh toan ngan hang`, id);

      return res.json({
        success: true,
        message: "Xac nhan thanh toan ngan hang thanh cong",
      });
    });
  });
};

exports.updateBookingStatus = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({
      success: false,
      message: "Chi admin hoac staff moi co the cap nhat trang thai",
    });
  }

  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const bodyValidation = statusSchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({
      success: false,
      message: "Du lieu khong hop le: " + bodyValidation.error.details[0].message,
    });
  }

  const { id } = idValidation.value;
  const { status } = bodyValidation.value;

  ensureBookingStaffAssignmentsTable((staffTableErr) => {
    if (staffTableErr) {
      console.error("Ensure booking_staff_assignments error:", staffTableErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    db.query("SELECT id, user_id, status FROM bookings WHERE id = ?", [id], (findErr, rows) => {
      if (findErr) {
        console.error("Find booking error:", findErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Booking khong ton tai" });
      }

      const booking = rows[0];

      const validateStaffAccess = (callback) => {
        if (req.user.role !== "staff") {
          return callback(null);
        }

        db.query(
          "SELECT 1 FROM booking_staff_assignments WHERE booking_id = ? AND staff_id = ? LIMIT 1",
          [id, req.user.id],
          (assignmentErr, assignmentRows) => {
            if (assignmentErr) {
              console.error("Check booking assignment error:", assignmentErr);
              return callback(assignmentErr);
            }

            if (assignmentRows.length === 0) {
              return callback(new Error("forbidden"));
            }

            return callback(null);
          }
        );
      };

      validateStaffAccess((accessErr) => {
        if (accessErr && accessErr.message === "forbidden") {
          return res.status(403).json({ success: false, message: "Booking khong thuoc pham vi cua ban" });
        }

        if (accessErr) {
          return res.status(500).json({ success: false, message: "Loi server" });
        }

        if (req.user.role === "staff") {
          const allowedTargets = allowedTransitionsByStaff[booking.status] || [];
          if (!allowedTargets.includes(status)) {
            return res.status(400).json({
              success: false,
              message: `Khong the chuyen trang thai tu ${booking.status} sang ${status}`,
            });
          }
        }

        const sql = `
          UPDATE bookings
          SET status = ?, staff_id = COALESCE(staff_id, ?)
          WHERE id = ?
        `;

        db.query(sql, [status, req.user.role === "staff" ? req.user.id : null, id], (err, result) => {
          if (err) {
            console.error("Update booking status error:", err);
            return res.status(500).json({ success: false, message: "Loi server" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Booking khong ton tai" });
          }

          createNotification(booking.user_id, `Booking #${id} duoc cap nhat trang thai: ${status}`, id);

          return res.json({ success: true, message: "Cap nhat trang thai thanh cong" });
        });
      });
    });
  });
};

exports.assignStaff = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Chi admin moi co the gan nhan vien" });
  }

  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const bodyValidation = assignStaffSchema.validate(req.body);
  if (bodyValidation.error) {
    return res.status(400).json({ success: false, message: "Du lieu staff_id khong hop le" });
  }

  const { id } = idValidation.value;
  const rawStaffIds = bodyValidation.value.staff_ids || [];
  const staffIds = [...new Set(rawStaffIds.map((id) => Number(id)).filter(Boolean))];

  if (staffIds.length === 0) {
    return res.status(400).json({ success: false, message: "Can it nhat 1 staff hop le" });
  }

  ensureSecondaryStaffColumn((columnErr) => {
    if (columnErr) {
      console.error("Ensure secondary_staff_id error:", columnErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    // First, get booking details (date and time_slot)
    db.query("SELECT booking_date, time_slot FROM bookings WHERE id = ?", [id], (bookingErr, bookingRows) => {
      if (bookingErr) {
        console.error("Find booking error:", bookingErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      if (bookingRows.length === 0) {
        return res.status(404).json({ success: false, message: "Booking khong ton tai" });
      }

      const booking = bookingRows[0];
      const bookingDate = booking.booking_date;
      const timeSlot = booking.time_slot;

      // Validate staff IDs and roles
      const placeholders = staffIds.map(() => "?").join(", ");
      db.query(`SELECT id, name, role FROM users WHERE id IN (${placeholders})`, staffIds, (staffErr, staffRows) => {
        if (staffErr) {
          console.error("Find staff error:", staffErr);
          return res.status(500).json({ success: false, message: "Loi server" });
        }

        if (staffRows.length !== staffIds.length || staffRows.some((row) => row.role !== "staff")) {
          return res.status(400).json({ success: false, message: "Danh sach staff khong hop le" });
        }

        // Check staff availability for each staff member
        let availabilityChecksDone = 0;
        let availabilityIssue = null;

        staffIds.forEach((staffId) => {
          checkStaffAvailability(staffId, bookingDate, timeSlot, id, (checkErr, isAvailable) => {
            if (checkErr) {
              console.error("Check staff availability error:", checkErr);
              availabilityIssue = "Loi server";
            }

            if (!isAvailable && !availabilityIssue) {
              const staffName = staffRows.find(s => s.id === staffId)?.name || `ID ${staffId}`;
              availabilityIssue = `Nhan vien ID ${staffId} da co lich lam viec trong khung gio nay`;
            }

            availabilityChecksDone++;

            // Once all checks are done, proceed with assignment if all available
            if (availabilityChecksDone === staffIds.length) {
              if (availabilityIssue) {
                return res.status(409).json({ success: false, message: availabilityIssue });
              }

              // All staff are available, proceed with assignment
              const primaryStaffId = staffIds[0] || null;
              const secondaryStaffId = staffIds[1] || null;

              db.beginTransaction((txErr) => {
                if (txErr) {
                  console.error("Begin assign transaction error:", txErr);
                  return res.status(500).json({ success: false, message: "Loi server" });
                }

                const updateBookingSql = `
                  UPDATE bookings
                  SET staff_id = ?,
                      secondary_staff_id = ?,
                      status = CASE WHEN status = 'pending' THEN 'confirmed' ELSE status END
                  WHERE id = ?
                `;

                db.query(updateBookingSql, [primaryStaffId, secondaryStaffId, id], (updateErr, updateResult) => {
                  if (updateErr) {
                    return db.rollback(() => {
                      console.error("Assign staff update error:", updateErr);
                      return res.status(500).json({ success: false, message: "Loi server" });
                    });
                  }

                  if (updateResult.affectedRows === 0) {
                    return db.rollback(() => res.status(404).json({ success: false, message: "Booking khong ton tai" }));
                  }

                  db.query("DELETE FROM booking_staff_assignments WHERE booking_id = ?", [id], (deleteErr) => {
                    if (deleteErr) {
                      return db.rollback(() => {
                        console.error("Clear booking assignments error:", deleteErr);
                        return res.status(500).json({ success: false, message: "Loi server" });
                      });
                    }

                    const assignmentValues = staffIds.map((staffId) => [id, staffId]);
                    db.query(
                      "INSERT INTO booking_staff_assignments (booking_id, staff_id) VALUES ?",
                      [assignmentValues],
                      (insertErr) => {
                        if (insertErr) {
                          return db.rollback(() => {
                            console.error("Insert booking assignments error:", insertErr);
                            return res.status(500).json({ success: false, message: "Loi server" });
                          });
                        }

                        db.commit((commitErr) => {
                          if (commitErr) {
                            return db.rollback(() => {
                              console.error("Commit assign staff error:", commitErr);
                              return res.status(500).json({ success: false, message: "Loi server" });
                            });
                          }

                          staffIds.forEach((staffId) => {
                            createNotification(staffId, `Ban duoc phan cong booking #${id}`, id);
                          });

                          return res.json({ success: true, message: "Gan nhan vien thanh cong" });
                        });
                      }
                    );
                  });
                });
              });
            }
          });
        });
      });
    });
  });
};

exports.updateCompletion = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "staff") {
    return res.status(403).json({ success: false, message: "Khong co quyen cap nhat thong tin hoan thanh" });
  }

  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const bodyValidation = completionSchema.validate(req.body || {});
  if (bodyValidation.error) {
    return res.status(400).json({ success: false, message: "Du lieu completion khong hop le" });
  }

  const { id } = idValidation.value;
  const { completion_note, before_image, after_image, status } = bodyValidation.value;

  ensureBookingStaffAssignmentsTable((staffTableErr) => {
    if (staffTableErr) {
      console.error("Ensure booking_staff_assignments error:", staffTableErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    db.query("SELECT id, user_id FROM bookings WHERE id = ?", [id], (findErr, rows) => {
    if (findErr) {
      console.error("Find booking for completion error:", findErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

      const booking = rows[0];

      if (req.user.role === "staff") {
        db.query(
          "SELECT 1 FROM booking_staff_assignments WHERE booking_id = ? AND staff_id = ? LIMIT 1",
          [id, req.user.id],
          (assignmentErr, assignmentRows) => {
            if (assignmentErr) {
              console.error("Check booking assignment error:", assignmentErr);
              return res.status(500).json({ success: false, message: "Loi server" });
            }

            if (assignmentRows.length === 0) {
              return res.status(403).json({ success: false, message: "Booking khong thuoc pham vi cua ban" });
            }

            applyCompletionUpdate(booking);
          }
        );
      } else {
        applyCompletionUpdate(booking);
      }

      function applyCompletionUpdate(currentBooking) {
        const sql = `
          UPDATE bookings
          SET completion_note = ?,
              before_image = COALESCE(?, before_image),
              after_image = COALESCE(?, after_image),
              status = ?,
              staff_id = COALESCE(staff_id, ?)
          WHERE id = ?
        `;

        db.query(
          sql,
          [completion_note || null, before_image || null, after_image || null, status, req.user.role === "staff" ? req.user.id : null, id],
          (err, result) => {
            if (err) {
              console.error("Update completion error:", err);
              return res.status(500).json({ success: false, message: "Loi server" });
            }

            if (result.affectedRows === 0) {
              return res.status(404).json({ success: false, message: "Booking khong ton tai" });
            }

            createNotification(currentBooking.user_id, `Booking #${id} da duoc cap nhat ket qua cham soc`, id);
            return res.json({ success: true, message: "Cap nhat ket qua cham soc thanh cong" });
          }
        );
      }
    });
  });
};

exports.updateBookingSchedule = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Chi admin moi co the doi lich booking" });
  }

  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const bodyValidation = scheduleSchema.validate(req.body || {});
  if (bodyValidation.error) {
    return res.status(400).json({
      success: false,
      message: "Du lieu lich hen khong hop le: " + bodyValidation.error.details[0].message,
    });
  }

  const { id } = idValidation.value;
  const { booking_date, time_slot } = bodyValidation.value;

  const normalizedDate = new Date(booking_date);
  normalizedDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(normalizedDate.getTime()) || normalizedDate < today) {
    return res.status(400).json({
      success: false,
      message: "Ngay hen phai tu hom nay tro di",
    });
  }

  db.query("SELECT id, user_id, status FROM bookings WHERE id = ?", [id], (findErr, rows) => {
    if (findErr) {
      console.error("Find booking for schedule update error:", findErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

    const booking = rows[0];

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Khong the doi lich booking da hoan thanh hoac da huy",
      });
    }

    const checkConflictSql = `
      SELECT id
      FROM bookings
      WHERE user_id = ?
        AND DATE(booking_date) = DATE(?)
        AND time_slot = ?
        AND status IN ('pending', 'confirmed', 'in_progress')
        AND id <> ?
      LIMIT 1
    `;

    db.query(checkConflictSql, [booking.user_id, normalizedDate, time_slot, id], (checkErr, checkRows) => {
      if (checkErr) {
        console.error("Check schedule conflict error:", checkErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      if (checkRows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Khach hang da co lich hen o khung gio nay",
        });
      }

      const updateSql = `
        UPDATE bookings
        SET booking_date = ?,
            time_slot = ?
        WHERE id = ?
      `;

      db.query(updateSql, [normalizedDate, time_slot, id], (updateErr, updateResult) => {
        if (updateErr) {
          console.error("Update booking schedule error:", updateErr);
          return res.status(500).json({ success: false, message: "Loi server" });
        }

        if (updateResult.affectedRows === 0) {
          return res.status(404).json({ success: false, message: "Booking khong ton tai" });
        }

        createNotification(booking.user_id, `Booking #${id} da duoc doi lich hen`, id);

        return res.json({ success: true, message: "Doi lich booking thanh cong" });
      });
    });
  });
};

exports.deleteBooking = (req, res) => {
  const { error, value } = bookingIdSchema.validate(req.params);
  if (error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const { id } = value;

  db.query("SELECT user_id, status, payment_method, payment_status FROM bookings WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Check ownership error:", err);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "Don dat lich khong ton tai" });
    }

    const currentStatus = result[0].status;
    const paymentMethod = result[0].payment_method;
    const paymentStatus = result[0].payment_status;

    if (req.user.role !== "admin" && req.user.role !== "staff" && result[0].user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Ban khong co quyen xoa don dat lich nay",
      });
    }

    if (currentStatus === "completed") {
      return res.status(400).json({ success: false, message: "Khong the huy booking da hoan thanh" });
    }

    if (req.user.role === "user" && !["pending", "confirmed"].includes(currentStatus)) {
      return res.status(400).json({ success: false, message: "Chi duoc huy booking dang pending hoac confirmed" });
    }

    if (currentStatus === "cancelled") {
      return res.json({ success: true, message: "Booking nay da o trang thai da huy" });
    }

    const cancelSql = "UPDATE bookings SET status = 'cancelled' WHERE id = ?";

    db.query(cancelSql, [id], (cancelErr, cancelResult) => {
      if (cancelErr) {
        console.error("Cancel booking error:", cancelErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      if (cancelResult.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Booking khong ton tai" });
      }

      const cancelMessage = paymentMethod === "bank" && paymentStatus === "paid"
        ? `Booking #${id} da duoc huy va dang cho hoan tien`
        : `Booking #${id} da duoc huy`;

      createNotification(result[0].user_id, cancelMessage, id);

      return res.json({ success: true, message: cancelMessage });
    });
  });
};

exports.getBookingDetail = (req, res) => {
  const idValidation = bookingIdSchema.validate(req.params);
  if (idValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const { id } = idValidation.value;

  const sql = `
    SELECT
      b.id,
      b.user_id,
      b.service_id,
      b.staff_id,
      b.secondary_staff_id,
      b.booking_date,
      b.time_slot,
      b.address,
      b.note,
      b.status,
      b.payment_method,
      b.payment_status,
      b.completion_note,
      b.before_image,
      b.after_image,
      b.created_at,
      b.updated_at,
      u.name AS user_name,
      u.email AS user_email,
      u.phone AS user_phone,
      s.name AS service_name,
      s.image AS service_image,
      s.price AS service_price,
      GROUP_CONCAT(DISTINCT bsa.staff_id ORDER BY bsa.staff_id SEPARATOR ',') AS staff_ids,
      GROUP_CONCAT(DISTINCT st.name ORDER BY st.name SEPARATOR ', ') AS staff_names
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN services s ON b.service_id = s.id
    LEFT JOIN booking_staff_assignments bsa ON bsa.booking_id = b.id
    LEFT JOIN users st ON st.id = bsa.staff_id
    WHERE b.id = ?
    GROUP BY b.id
  `;

  db.query(sql, [id], (err, bookingRows) => {
    if (err) {
      console.error("Get booking detail error:", err);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (bookingRows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

    const booking = bookingRows[0];

    // Check permission
    if (req.user.role !== "admin" && req.user.role !== "staff" && booking.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Ban khong co quyen xem booking nay" });
    }

    // Get booking items
    const itemsSql = `
      SELECT
        bi.id,
        bi.service_id,
        bi.quantity,
        bi.unit_price,
        bi.status as item_status,
        s.name AS service_name,
        s.image AS service_image
      FROM booking_items bi
      JOIN services s ON s.id = bi.service_id
      WHERE bi.booking_id = ?
      ORDER BY bi.id ASC
    `;

    db.query(itemsSql, [id], (itemsErr, itemsRows) => {
      if (itemsErr) {
        console.error("Get booking items error:", itemsErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      const serviceItems = itemsRows && itemsRows.length > 0 ? itemsRows : [
        {
          id: null,
          service_id: booking.service_id,
          service_name: booking.service_name,
          service_image: booking.service_image,
          quantity: 1,
          unit_price: booking.service_price,
          item_status: "active",
        },
      ];

      const totalPrice = serviceItems
        .filter(item => item.item_status === "active")
        .reduce((sum, item) => sum + (Number(item.unit_price || 0) * Number(item.quantity || 1)), 0);

      return res.json({
        success: true,
        data: {
          ...booking,
          booking_id: booking.id,
          service_price: Number(booking.service_price || 0),
          service_items: serviceItems.map(item => ({
            id: item.id,
            service_id: item.service_id,
            service_name: item.service_name,
            service_image: item.service_image,
            quantity: Number(item.quantity || 1),
            unit_price: Number(item.unit_price || 0),
            status: item.item_status,
          })),
          staff_ids: booking.staff_ids
            ? String(booking.staff_ids)
                .split(",")
                .map(id => Number(id))
                .filter(id => Number.isInteger(id) && id > 0)
            : [],
          staff_names: booking.staff_names
            ? String(booking.staff_names)
                .split(",")
                .map(name => name.trim())
                .filter(Boolean)
            : [],
          status_vietnamese: statusTranslations[booking.status] || booking.status,
          payment_method_vietnamese: paymentMethodTranslations[booking.payment_method] || booking.payment_method,
          payment_status_vietnamese: paymentStatusTranslations[booking.payment_status] || booking.payment_status,
          total_price: totalPrice,
        },
      });
    });
  });
};

exports.cancelBookingItem = (req, res) => {
  const bookingIdValidation = bookingIdSchema.validate(req.params);
  if (bookingIdValidation.error) {
    return res.status(400).json({ success: false, message: "ID booking khong hop le" });
  }

  const itemIdSchema = Joi.object({
    itemId: Joi.number().integer().positive().required(),
  });

  const itemIdValidation = itemIdSchema.validate(req.params);
  if (itemIdValidation.error) {
    return res.status(400).json({ success: false, message: "ID dich vu khong hop le" });
  }

  const { id: bookingId, itemId } = { ...bookingIdValidation.value, ...itemIdValidation.value };

  // Check booking ownership
  db.query("SELECT user_id, status FROM bookings WHERE id = ?", [bookingId], (bookingErr, bookingRows) => {
    if (bookingErr) {
      console.error("Check booking ownership error:", bookingErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (bookingRows.length === 0) {
      return res.status(404).json({ success: false, message: "Booking khong ton tai" });
    }

    const booking = bookingRows[0];

    // Permission check - user can only cancel own bookings
    if (req.user.role !== "admin" && booking.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "Ban khong co quyen huy dich vu trong booking nay" });
    }

    // Can only cancel pending or confirmed bookings
    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({ success: false, message: "Chi duoc huy dich vu trong booking dang pending hoac confirmed" });
    }

    // Check booking item exists and belongs to this booking
    db.query("SELECT id, status FROM booking_items WHERE id = ? AND booking_id = ?", [itemId, bookingId], (itemErr, itemRows) => {
      if (itemErr) {
        console.error("Check booking item error:", itemErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      if (itemRows.length === 0) {
        return res.status(404).json({ success: false, message: "Dich vu trong booking khong ton tai" });
      }

      const bookingItem = itemRows[0];

      if (bookingItem.status === "cancelled") {
        return res.status(400).json({ success: false, message: "Dich vu nay da bi huy roi" });
      }

      // Cancel the item
      db.beginTransaction((txErr) => {
        if (txErr) {
          console.error("Begin transaction cancel item error:", txErr);
          return res.status(500).json({ success: false, message: "Loi server" });
        }

        const cancelSql = "UPDATE booking_items SET status = 'cancelled' WHERE id = ?";
        db.query(cancelSql, [itemId], (cancelErr) => {
          if (cancelErr) {
            return db.rollback(() => {
              console.error("Cancel booking item error:", cancelErr);
              return res.status(500).json({ success: false, message: "Loi server" });
            });
          }

          // Check if all items in the booking are cancelled
          const checkAllCancelledSql = `
            SELECT COUNT(*) as active_count
            FROM booking_items
            WHERE booking_id = ? AND status = 'active'
          `;

          db.query(checkAllCancelledSql, [bookingId], (checkErr, checkRows) => {
            if (checkErr) {
              return db.rollback(() => {
                console.error("Check all items cancelled error:", checkErr);
                return res.status(500).json({ success: false, message: "Loi server" });
              });
            }

            const activeCount = checkRows[0].active_count;

            // If all items are cancelled, mark booking as cancelled
            if (activeCount === 0) {
              const cancelBookingSql = "UPDATE bookings SET status = 'cancelled' WHERE id = ?";
              db.query(cancelBookingSql, [bookingId], (cancelBookingErr) => {
                if (cancelBookingErr) {
                  return db.rollback(() => {
                    console.error("Cancel booking error:", cancelBookingErr);
                    return res.status(500).json({ success: false, message: "Loi server" });
                  });
                }

                return db.commit((commitErr) => {
                  if (commitErr) {
                    return db.rollback(() => {
                      console.error("Commit cancel item error:", commitErr);
                      return res.status(500).json({ success: false, message: "Loi server" });
                    });
                  }

                  createNotification(booking.user_id, `Huy tat ca dich vu trong booking #${bookingId}. Booking nay da bi huy.`, bookingId);

                  return res.json({ success: true, message: "Huy dich vu thanh cong. Vi tat ca dich vu da bi huy, booking nay cung da bi huy." });
                });
              });
            } else {
              return db.commit((commitErr) => {
                if (commitErr) {
                  return db.rollback(() => {
                    console.error("Commit cancel item error:", commitErr);
                    return res.status(500).json({ success: false, message: "Loi server" });
                  });
                }

                createNotification(booking.user_id, `Dich vu trong booking #${bookingId} da bi huy.`, bookingId);

                return res.json({ success: true, message: "Huy dich vu thanh cong" });
              });
            }
          });
        });
      });
    });
  });
};
exports.checkStaffAvailabilityEndpoint = (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Chi admin moi co the kiem tra khả nang của nhan vien" });
  }

  const checkSchema = Joi.object({
    staff_id: Joi.number().integer().positive().required(),
    booking_date: Joi.date().required(),
    time_slot: Joi.string().valid("morning", "afternoon").required(),
    exclude_booking_id: Joi.number().integer().positive().allow(null),
  });

  const { error, value } = checkSchema.validate(req.query);
  if (error) {
    return res.status(400).json({ success: false, message: "Query parameters khong hop le" });
  }

  const { staff_id, booking_date, time_slot, exclude_booking_id } = value;

  // Verify staff exists and has staff role
  db.query("SELECT id, name, role FROM users WHERE id = ?", [staff_id], (staffErr, staffRows) => {
    if (staffErr) {
      console.error("Find staff error:", staffErr);
      return res.status(500).json({ success: false, message: "Loi server" });
    }

    if (staffRows.length === 0 || staffRows[0].role !== "staff") {
      return res.status(400).json({ success: false, message: "Nhan vien khong ton tai hoac khong hop le" });
    }

    const staff = staffRows[0];

    // Check availability
    checkStaffAvailability(staff_id, booking_date, time_slot, exclude_booking_id, (checkErr, isAvailable) => {
      if (checkErr) {
        console.error("Check availability error:", checkErr);
        return res.status(500).json({ success: false, message: "Loi server" });
      }

      return res.json({
        success: true,
        data: {
          staff_id,
          staff_name: staff.name,
          booking_date,
          time_slot,
          is_available: isAvailable,
        },
      });
    });
  });
};
