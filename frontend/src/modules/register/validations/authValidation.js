export const validateEmail = (email) => {
  if (!email || !email.trim())
    return { isValid: false, message: "El correo electrónico es obligatorio." };
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  if (!gmailRegex.test(email.trim()))
    return {
      isValid: false,
      message: "El correo debe ser una dirección de Gmail (@gmail.com).",
    };
  return { isValid: true, message: "" };
};

export const validatePassword = (password) => {
  if (!password)
    return { isValid: false, message: "La contraseña es obligatoria." };
  if (password.length < 8)
    return {
      isValid: false,
      message: "La contraseña debe tener mínimo 8 caracteres.",
    };
  const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
  if (uppercaseCount < 2)
    return {
      isValid: false,
      message: "La contraseña debe contener al menos 2 letras mayúsculas.",
    };
  const lowercaseCount = (password.match(/[a-z]/g) || []).length;
  if (lowercaseCount < 2)
    return {
      isValid: false,
      message: "La contraseña debe contener al menos 2 letras minúsculas.",
    };
  const numberCount = (password.match(/[0-9]/g) || []).length;
  if (numberCount < 2)
    return {
      isValid: false,
      message: "La contraseña debe contener al menos 2 números.",
    };
  const symbolCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;
  if (symbolCount < 1)
    return {
      isValid: false,
      message: "La contraseña debe contener al menos 1 símbolo.",
    };
  return { isValid: true, message: "" };
};

export const validateName = (name, fieldName = "Este campo") => {
  if (!name || !name.trim())
    return { isValid: false, message: `${fieldName} es obligatorio.` };
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nameRegex.test(name.trim()))
    return {
      isValid: false,
      message: `${fieldName} solo puede contener letras.`,
    };
  if (name.trim().length < 3)
    return {
      isValid: false,
      message: `${fieldName} debe tener mínimo 3 caracteres.`,
    };
  if (name.trim().length > 10)
    return {
      isValid: false,
      message: `${fieldName} debe tener máximo 10 caracteres.`,
    };
  return { isValid: true, message: "" };
};

export const validateStep1 = (data) => {
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) return emailValidation;
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) return passwordValidation;
  if (!data.confirmar)
    return { isValid: false, message: "Debe confirmar la contraseña." };
  if (data.password !== data.confirmar)
    return { isValid: false, message: "Las contraseñas no coinciden." };
  return { isValid: true, message: "" };
};

export const validateStep2 = (data) => {
  const pn = validateName(data.primerNombre, "El primer nombre");
  if (!pn.isValid) return pn;
  const pa = validateName(data.primerApellido, "El primer apellido");
  if (!pa.isValid) return pa;
  if (data.segundoNombre && data.segundoNombre.trim()) {
    const sn = validateName(data.segundoNombre, "El segundo nombre");
    if (!sn.isValid) return sn;
  }
  if (data.segundoApellido && data.segundoApellido.trim()) {
    const sa = validateName(data.segundoApellido, "El segundo apellido");
    if (!sa.isValid) return sa;
  }
  if (!data.telefono || !/^\d{10}$/.test(data.telefono))
    return { isValid: false, message: "El teléfono debe tener 10 dígitos." };
  return { isValid: true, message: "" };
};

export const validateStep3 = (data) => {
  if (!data.pais)
    return { isValid: false, message: "Debe seleccionar un país." };
  if (!data.estado)
    return { isValid: false, message: "Debe seleccionar un estado." };
  if (!data.ciudad)
    return { isValid: false, message: "Debe seleccionar una ciudad." };
  if (!data.companiaId)
    return { isValid: false, message: "Debe seleccionar una empresa." };
  return { isValid: true, message: "" };
};

export const validateStep4 = (code) => {
  if (!code || code.length !== 6)
    return {
      isValid: false,
      message: "El código debe tener exactamente 6 dígitos.",
    };
  return { isValid: true, message: "" };
};
