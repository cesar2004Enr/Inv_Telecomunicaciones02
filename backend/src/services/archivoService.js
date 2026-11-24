const prisma = require("../config/prisma");

const createArchivo = async (data, userId) => {
    return await prisma.archivo.create({
        data: {
            nombre: data.nombre,
            contenido: data.contenido,
            tamano: data.tamano,
            datosUsuarioId: userId,
        },
    });
};

const getArchivosByUser = async (userId) => {
    return await prisma.archivo.findMany({
        where: { datosUsuarioId: userId },
        orderBy: { updatedAt: "desc" },
    });
};

const getArchivoById = async (id, userId) => {
    const archivo = await prisma.archivo.findFirst({
        where: { id, datosUsuarioId: userId },
    });
    if (!archivo) throw new Error("Archivo no encontrado");
    return archivo;
};

const updateArchivo = async (id, data, userId) => {
    // Verificamos que el archivo pertenezca al usuario
    const existe = await prisma.archivo.findFirst({
        where: { id, datosUsuarioId: userId },
    });
    if (!existe) throw new Error("Archivo no encontrado");

    return await prisma.archivo.update({
        where: { id },
        data: {
            nombre: data.nombre,
            contenido: data.contenido,
            tamano: data.tamano,
        },
    });
};

const deleteArchivo = async (id, userId) => {
    return await prisma.archivo.deleteMany({
        where: { id, datosUsuarioId: userId },
    });
};

module.exports = {
    createArchivo,
    getArchivosByUser,
    getArchivoById,
    updateArchivo,
    deleteArchivo,
};
