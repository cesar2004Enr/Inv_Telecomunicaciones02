const archivoService = require("../services/archivoService");

const create = async (req, res, next) => {
    try {
        const result = await archivoService.createArchivo(req.body, req.userId);
        res.status(201).json({ success: true, data: result });
    } catch (error) { next(error); }
};

const getAll = async (req, res, next) => {
    try {
        const result = await archivoService.getArchivosByUser(req.userId);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
};

const getOne = async (req, res, next) => {
    try {
        const result = await archivoService.getArchivoById(req.params.id, req.userId);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const result = await archivoService.updateArchivo(req.params.id, req.body, req.userId);
        res.json({ success: true, data: result });
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    try {
        await archivoService.deleteArchivo(req.params.id, req.userId);
        res.json({ success: true, message: "Archivo eliminado" });
    } catch (error) { next(error); }
};

module.exports = { create, getAll, getOne, update, remove };