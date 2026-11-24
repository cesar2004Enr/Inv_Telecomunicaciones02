const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const equipmentController = require("../controllers/equipmentController");

router.put("/update/:id", authenticate, equipmentController.updateEquipment);

router.get("/", authenticate, equipmentController.getAllEquipment);
router.post("/", authenticate, equipmentController.addEquipment);
router.get("/:tipo", authenticate, equipmentController.getEquipmentByType);
router.delete("/:tipo", authenticate, equipmentController.deleteEquipment);

module.exports = router;
