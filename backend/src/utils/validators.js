const { body, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0].msg,
      errors: errors.array(),
    });
  }
  next();
};

const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const passwordRegex =
  /^(?=(.*[a-z]){2,})(?=(.*[A-Z]){2,})(?=(.*\d){2,})(?=(.*[\W_]){1,}).{8,}$/;
const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,10}$/;
const phoneRegex = /^\d{10}$/;

const registerStep1Validation = [
  body("email")
    .matches(gmailRegex)
    .withMessage("El correo debe ser una dirección de Gmail (@gmail.com)"),
  body("password")
    .matches(passwordRegex)
    .withMessage(
      "La contraseña debe tener mínimo 8 caracteres, 2 mayúsculas, 2 minúsculas, 2 números y 1 símbolo",
    ),
  body("confirmar").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Las contraseñas no coinciden");
    }
    return true;
  }),
  validate,
];

const loginValidation = [
  body("email")
    .matches(gmailRegex)
    .withMessage("El correo debe ser una dirección de Gmail (@gmail.com)"),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
  validate,
];

const step2Validation = [
  body("primerNombre")
    .matches(nameRegex)
    .withMessage(
      "Primer nombre es obligatorio, debe tener entre 3 y 10 letras",
    ),
  body("primerApellido")
    .matches(nameRegex)
    .withMessage(
      "Primer apellido es obligatorio, debe tener entre 3 y 10 letras",
    ),
  body("segundoNombre")
    .optional({ values: "falsy" })
    .matches(nameRegex)
    .withMessage("Segundo nombre debe tener entre 3 y 10 letras, solo letras"),
  body("segundoApellido")
    .optional({ values: "falsy" })
    .matches(nameRegex)
    .withMessage(
      "Segundo apellido debe tener entre 3 y 10 letras, solo letras",
    ),
  body("telefono")
    .matches(phoneRegex)
    .withMessage(
      "El teléfono es obligatorio y debe tener exactamente 10 dígitos",
    ),
  validate,
];

module.exports = {
  registerStep1Validation,
  loginValidation,
  step2Validation,
};
