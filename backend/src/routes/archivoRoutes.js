const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const archivoController = require("../controllers/archivoController");

router.use(authenticate);

router.post("/", archivoController.create);
router.get("/", archivoController.getAll);
router.get("/:id", archivoController.getOne);
router.put("/:id", archivoController.update);
router.delete("/:id", archivoController.remove);

module.exports = router;