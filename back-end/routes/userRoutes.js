const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

/* USERS */
router.get("/users", authMiddleware, adminMiddleware, userController.getUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, userController.deleteUser);
router.put("/users/:id/role", authMiddleware, adminMiddleware, userController.updateUserRole);

module.exports = router;