const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const pingController = require("../controllers/pingController");

router.post("/update", authenticate, pingController.updateStatus);
router.get("/check/:ip", authenticate, pingController.checkDevice);

module.exports = router;
