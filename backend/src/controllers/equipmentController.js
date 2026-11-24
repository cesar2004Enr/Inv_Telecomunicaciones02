const equipmentService = require("../services/equipmentService");

const addEquipment = async (req, res, next) => {
  try {
    const userId = req.userId;
    const result = await equipmentService.addEquipment(req.body, userId);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getEquipmentByType = async (req, res, next) => {
  try {
    const { tipo } = req.params;
    const { search } = req.query;
    const userId = req.userId;
    const result = await equipmentService.getEquipmentByType(
      tipo,
      userId,
      search || "",
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const getAllEquipment = async (req, res, next) => {
  try {
    const { search } = req.query;
    const userId = req.userId;
    const result = await equipmentService.getAllEquipment(userId, search || "");
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const deleteEquipment = async (req, res, next) => {
  try {
    const { tipo } = req.params;
    const { ids } = req.body;
    const userId = req.userId;
    const result = await equipmentService.deleteEquipment(tipo, ids, userId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const updateEquipment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    console.log(`📝 EDITANDO DISPOSITIVO: ${id}`);
    console.log(`👤 Usuario: ${userId}`);
    console.log(`📦 Datos:`, req.body);

    const result = await equipmentService.updateEquipment(id, req.body, userId);

    if (result) {
      console.log(
        `✅ DISPOSITIVO ACTUALIZADO: ${result.nombreEquipo || "Sin nombre"}`,
      );
    } else {
      console.log(`⚠️ Resultado vacío del servicio`);
    }

    res.json({ success: true, data: result || {} });
  } catch (error) {
    console.error(`❌ Error al editar:`, error.message);
    next(error);
  }
};

module.exports = {
  addEquipment,
  getEquipmentByType,
  getAllEquipment,
  deleteEquipment,
  updateEquipment,
};
