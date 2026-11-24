const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);
const prisma = require("../config/prisma");

const pingDevice = async (ip) => {
  try {
    await execPromise(`ping -c 1 -W 2 ${ip}`, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
};

const updateUserDevicesStatus = async (userId) => {
  console.log(`\n🔄 ACTUALIZANDO ESTADOS PARA USUARIO: ${userId}`);

  const interfaces = await prisma.interfaz.findMany({
    where: {
      dispositivo: {
        datosUsuarioId: userId,
      },
    },
    include: {
      dispositivo: true,
    },
    distinct: ["dispositivoId"],
  });

  if (interfaces.length === 0) {
    console.log(`  No hay dispositivos para este usuario`);
    return { activos: 0, inactivos: 0, total: 0 };
  }

  let activos = 0,
    inactivos = 0;

  for (const iface of interfaces) {
    const ip = iface.direccionIpv4;
    if (!ip || ip === "0.0.0.0") continue;

    const activo = await pingDevice(ip);
    const nuevoEstado = activo ? "Activo" : "Inactivo";

    await prisma.dispositivo.update({
      where: { id: iface.dispositivoId },
      data: {
        actividad: nuevoEstado,
        fechaActualizacion: new Date(),
      },
    });

    if (iface.dispositivo.actividad !== nuevoEstado) {
      console.log(
        `  ${activo ? "🟢" : "🔴"} ${iface.dispositivo.nombreEquipo} (${ip}): ${iface.dispositivo.actividad} → ${nuevoEstado}`,
      );
    } else {
      console.log(
        `  ✅ ${iface.dispositivo.nombreEquipo} (${ip}): ${nuevoEstado} (sin cambios)`,
      );
    }

    if (activo) activos++;
    else inactivos++;
  }

  console.log(
    `✅ ACTUALIZACIÓN COMPLETADA: ${activos} activos, ${inactivos} inactivos\n`,
  );
  return { activos, inactivos, total: interfaces.length };
};

module.exports = { updateUserDevicesStatus, pingDevice };
