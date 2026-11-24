const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  loginValidation,
  registerStep1Validation,
  step2Validation,
} = require("../utils/validators");

router.get("/fiscalias", authController.getFiscalias);
router.get("/fiscalias/:id", authController.getFiscaliaById);

router.post("/login", loginValidation, authController.login);
router.post(
  "/register/step1",
  registerStep1Validation,
  authController.registerStep1,
);
router.put(
  "/register/step2/:userId",
  step2Validation,
  authController.registerStep2,
);
router.put("/register/step3/:userId", authController.registerStep3);
router.post("/register/step4/:userId", authController.registerStep4);
router.post("/register/resend/:userId", authController.resendCode);

module.exports = router;
