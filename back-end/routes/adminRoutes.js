const express = require("express");
const router = express.Router();

const adminController = require("../controller/adminController");
const userController = require("../controller/userController");
const serviceController = require("../controller/serviceController");

/* TEST */
console.log("userController:", userController);
console.log("serviceController:", serviceController);

/* DASHBOARD */
router.get("/dashboard", adminController.getDashboardStats);

/* USERS */
router.get("/users", userController.getUsers);
router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id", userController.updateUserRole);

/* SERVICES */
/* SERVICES */
router.get("/services", serviceController.getAll);
router.post("/services", serviceController.create);
router.put("/services/:id", serviceController.update);
router.delete("/services/:id", serviceController.remove);

module.exports = router;