const express = require("express");
const router = express.Router();
const serviceController = require("../controller/serviceController");

router.get("/services", serviceController.getAll);
router.get("/services/:id", serviceController.getOne);
router.post("/services", serviceController.create);
router.put("/services/:id", serviceController.update);
router.delete("/services/:id", serviceController.remove);

module.exports = router;