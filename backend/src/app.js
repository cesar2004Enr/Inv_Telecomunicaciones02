const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const scanRoutes = require("./routes/scanRoutes");
const { errorHandler } = require("./middlewares/errorHandler");
const pingRoutes = require("./routes/pingRoutes");
const archivoRoutes = require("./routes/archivoRoutes");


const app = express();

app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/ping", pingRoutes);
app.use("/api/archivos", archivoRoutes);


app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API funcionando",
    timestamp: new Date().toISOString(),
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});

module.exports = app;
