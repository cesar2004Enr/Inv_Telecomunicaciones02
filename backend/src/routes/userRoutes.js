const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");

router.get("/profile", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Perfil de usuario accedido correctamente",
    userId: req.userId,
  });
});

module.exports = router;
