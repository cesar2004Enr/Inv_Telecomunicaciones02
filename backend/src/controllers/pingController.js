const pingService = require("../services/pingService");

const updateStatus = async (req, res, next) => {
  try {
    const userId = req.userId;
    const result = await pingService.updateUserDevicesStatus(userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const checkDevice = async (req, res, next) => {
  try {
    const { ip } = req.params;
    const activo = await pingService.pingDevice(ip);
    res.json({
      success: true,
      data: { ip, activo, estado: activo ? "Activo" : "Inactivo" },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateStatus, checkDevice };
