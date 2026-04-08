const express = require("express");
const router = express.Router();
const employeesController = require("../controller/employeesController");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, adminMiddleware, employeesController.getEmployees);
router.get("/:id", authMiddleware, adminMiddleware, employeesController.getEmployeeById);
router.post("/", authMiddleware, adminMiddleware, employeesController.createEmployee);
router.put("/:id", authMiddleware, adminMiddleware, employeesController.updateEmployee);
router.delete("/:id", authMiddleware, adminMiddleware, employeesController.deleteEmployee);

module.exports = router;
