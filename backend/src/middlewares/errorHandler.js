const { Prisma } = require("@prisma/client");

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Ya existe un registro con ese valor único",
        field: err.meta?.target,
      });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      message: "Datos inválidos proporcionados",
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Error interno del servidor";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { errorHandler };
