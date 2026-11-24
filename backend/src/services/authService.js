const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer"); 
const { generateToken } = require("../utils/jwt");
const prisma = require("../config/prisma");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true para el puerto 465, false para 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const login = async (email, password) => {
  const correo = await prisma.correoUsuario.findUnique({
    where: { email },
    include: {
      datosUsuario: {
        include: {
          verificacion: true,
          fiscalia: true,
        },
      },
    },
  });

  if (!correo) throw new Error("Credenciales inválidas");

  const isValid = await bcrypt.compare(password, correo.password);
  if (!isValid) throw new Error("Credenciales inválidas");

  if (!correo.datosUsuario?.verificacion?.verified) {
    throw new Error("Verifica tu cuenta antes de iniciar sesión");
  }

  const token = generateToken(correo.datosUsuario.id);

  const user = correo.datosUsuario;
  const nombreCompleto = [
    user.primerNombre,
    user.segundoNombre,
    user.apellidoPaterno,
    user.apellidoMaterno,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    user: {
      id: user.id,
      email: correo.email,
      nombreCompleto,
      primerNombre: user.primerNombre,
      apellidoPaterno: user.apellidoPaterno,
      fiscalia: user.fiscalia,
    },
    token,
  };
};

const registerStep1 = async (userData) => {
  const existing = await prisma.correoUsuario.findUnique({
    where: { email: userData.email },
  });
  if (existing) throw new Error("El correo ya está registrado");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const datosUsuario = await prisma.datosUsuario.create({
    data: {
      primerNombre: "",
      apellidoPaterno: "",
      telefonoPersonal: "",
    },
  });

  await prisma.correoUsuario.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      datosUsuarioId: datosUsuario.id,
    },
  });

  await prisma.verificacionUsuario.create({
    data: {
      datosUsuarioId: datosUsuario.id,
    },
  });

  return {
    id: datosUsuario.id,
    email: userData.email,
    message: "Usuario creado exitosamente.",
  };
};

const registerStep2 = async (userId, userData) => {
  await prisma.datosUsuario.update({
    where: { id: userId },
    data: {
      primerNombre: userData.primerNombre,
      segundoNombre: userData.segundoNombre || null,
      apellidoPaterno: userData.primerApellido,
      apellidoMaterno: userData.segundoApellido || null,
      telefonoPersonal: userData.telefono,
    },
  });

  return { message: "Datos actualizados" };
};

const registerStep3 = async (userId, fiscaliaId) => {
  await prisma.datosUsuario.update({
    where: { id: userId },
    data: { fiscaliaId },
  });

  return { message: "Fiscalía asignada" };
};

const generateAndSendCode = async (userId) => {
  const code = generateCode();

  const user = await prisma.datosUsuario.findUnique({
    where: { id: userId },
    include: { correo: true },
  });

  if (!user || !user.correo) throw new Error("Usuario no encontrado");

  // Guardar código en la base de datos
  await prisma.verificacionUsuario.update({
    where: { datosUsuarioId: userId },
    data: { codigoVerificacion: code },
  });

  console.log(`\n═══════════════════════════════════════`);
  console.log(`📧 CÓDIGO GENERADO: ${code} para ${user.correo.email}`);
  console.log(`═══════════════════════════════════════\n`);

  // Enviar el correo real
  try {
    await transporter.sendMail({
      from: `"Inventario Telecom" <${process.env.SMTP_USER}>`,
      to: user.correo.email,
      subject: "Código de verificación - Inventario Telecom",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
          <h2 style="color: #1976d2; text-align: center;">Verificación de Cuenta</h2>
          <p>Hola <strong>${user.primerNombre || "Usuario"}</strong>,</p>
          <p>Has solicitado registrarte en el Inventario de Infraestructura de Telecomunicaciones.</p>
          <p>Tu código de verificación es:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1976d2;">${code}</span>
          </div>
          <p style="color: #666; font-size: 14px;">Si no solicitaste este código, puedes ignorar este mensaje.</p>
        </div>
      `,
    });
    console.log(`✅ Correo enviado exitosamente a ${user.correo.email}`);
  } catch (error) {
    console.error(`❌ Error al enviar correo:`, error.message);
    // No lanzamos error para no romper el flujo, el código ya está en pantalla
  }

  return {
    message: "Código enviado al correo electrónico",
    code: code, // Lo devolvemos por si quieres verlo en la pantalla durante pruebas
  };
};

const registerStep4 = async (userId, code) => {
  const verificacion = await prisma.verificacionUsuario.findUnique({
    where: { datosUsuarioId: userId },
  });

  if (!verificacion || verificacion.codigoVerificacion !== code) {
    throw new Error("Código inválido");
  }

  await prisma.verificacionUsuario.update({
    where: { datosUsuarioId: userId },
    data: { verified: true, codigoVerificacion: null },
  });

  return { message: "Cuenta verificada" };
};

const getFiscalias = async () => {
  return await prisma.fiscalia.findMany({
    select: { 
      id: true, 
      nombreEmpresa: true, 
      estado: true, 
      ciudad: true  // ← Agregar ciudad
    },
    orderBy: { nombreEmpresa: "asc" },
  });
};

const getFiscaliaById = async (id) => {
  return await prisma.fiscalia.findUnique({ where: { id } });
};

module.exports = {
  login,
  registerStep1,
  registerStep2,
  registerStep3,
  generateAndSendCode,
  registerStep4,
  getFiscalias,
  getFiscaliaById,
};
