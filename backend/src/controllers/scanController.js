const scanService = require("../services/scanService");

const startScan = async (req, res, next) => {
  try {
    const { ipInicio, ipFin } = req.body;

    if (!ipInicio || !ipFin) {
      return res
        .status(400)
        .json({ success: false, message: "IPs requeridas" });
    }

    console.log(`\n🔍 INICIANDO ESCANEO DE RANGO: ${ipInicio} - ${ipFin}`);
    const results = await scanService.scanRange(ipInicio, ipFin);
    console.log(`✅ ESCANEO COMPLETADO: ${results.length} IPs escaneadas\n`);

    res.json({ success: true, data: results });
  } catch (error) {
    next(error);
  }
};

module.exports = { startScan };
