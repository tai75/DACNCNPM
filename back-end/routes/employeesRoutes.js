const express = require("express");
const router = express.Router();
const employeesController = require("../controller/employeesController");
<<<<<<< HEAD
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/", authMiddleware, adminMiddleware, employeesController.getEmployees);
router.get("/:id", authMiddleware, adminMiddleware, employeesController.getEmployeeById);
router.post("/", authMiddleware, adminMiddleware, employeesController.createEmployee);
router.put("/:id", authMiddleware, adminMiddleware, employeesController.updateEmployee);
router.delete("/:id", authMiddleware, adminMiddleware, employeesController.deleteEmployee);
=======

router.get("/", employeesController.getEmployees);
router.get("/:id", employeesController.getEmployeeById);
router.post("/", employeesController.createEmployee);
router.put("/:id", employeesController.updateEmployee);
router.delete("/:id", employeesController.deleteEmployee);
>>>>>>> 9e7fdb6cbb05df1d5d8f41030d4d221d96a45577

module.exports = router;