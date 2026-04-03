const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

/* USERS */
router.get("/users", userController.getUsers);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id/role", userController.updateUserRole);

module.exports = router;