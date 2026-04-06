const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
<<<<<<< HEAD
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

/* USERS */
router.get("/users", authMiddleware, adminMiddleware, userController.getUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, userController.deleteUser);
router.put("/users/:id/role", authMiddleware, adminMiddleware, userController.updateUserRole);
=======

/* USERS */
router.get("/users", userController.getUsers);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id/role", userController.updateUserRole);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

module.exports = router;