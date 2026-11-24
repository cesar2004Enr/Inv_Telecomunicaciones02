const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const scanController = require("../controllers/scanController");

router.post("/start", authenticate, scanController.startScan);

module.exports = router;
