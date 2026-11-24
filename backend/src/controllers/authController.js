const authService = require("../services/authService");
const recaptchaService = require("../services/recaptchaService");

const getFiscalias = async (req, res, next) => {
  try {
    const result = await authService.getFiscalias();
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getFiscaliaById = async (req, res, next) => {
  try {
    const result = await authService.getFiscaliaById(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const registerStep1 = async (req, res, next) => {
  try {
    const { email, password, recaptchaToken } = req.body;

    if (!recaptchaToken) {
      return res.status(400).json({ message: "Por favor, marca la casilla de verificación." });
    }

    const isHuman = await recaptchaService.verifyRecaptcha(recaptchaToken);

    if (!isHuman) {
      return res.status(400).json({ message: "Verificación de robot fallida. Intenta de nuevo." });
    }

    const result = await authService.registerStep1(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const registerStep2 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await authService.registerStep2(userId, req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const registerStep3 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { companyId } = req.body;
    const result = await authService.registerStep3(userId, companyId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const registerStep4 = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { code } = req.body;
    const result = await authService.registerStep4(userId, code);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const resendCode = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await authService.generateAndSendCode(userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFiscalias,
  getFiscaliaById,
  login,
  registerStep1,
  registerStep2,
  registerStep3,
  registerStep4,
  resendCode,
};
