const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1. Insertar fiscalías
  const fiscalias = [
    {
      nombreEmpresa: "Estacionamiento Fiscalía General del Estado",
      telefonoEmpresa: "9933136550",
      pais: "México",
      estado: "Tabasco",
      ciudad: "Villahermosa",
      codigoPostal: "86080",
      calle: "Usumacinta",
      numeroExterior: "802",
      colonia: "Gil y Saenz",
      idCreacion: "FGE-EST-001",
    },
    {
      nombreEmpresa: "Fiscalía Especializada En Delitos Electorales",
      telefonoEmpresa: "9933136550",
      pais: "México",
      estado: "Tabasco",
      ciudad: "Villahermosa",
      codigoPostal: "86100",
      calle: "Guayacan",
      numeroExterior: "15",
      colonia: "Atasta de Serra",
      idCreacion: "FGE-FEDE-001",
    },
    {
      nombreEmpresa: "Fiscalía de Víctimas en Situación de Vulnerabilidad",
      telefonoEmpresa: "9933136550",
      pais: "México",
      estado: "Tabasco",
      ciudad: "Villahermosa",
      codigoPostal: "86030",
      calle: "Adolfo Ruiz Cortines",
      numeroExterior: "902",
      colonia: "Bonanza",
      idCreacion: "FGE-VSV-001",
    },
  ];

  for (const f of fiscalias) {
    // Verificar si ya existe
    const existe = await prisma.fiscalia.findFirst({
      where: { nombreEmpresa: f.nombreEmpresa },
    });

    if (!existe) {
      await prisma.fiscalia.create({ data: f });
      console.log(`  ✅ ${f.nombreEmpresa}`);
    } else {
      console.log(`  ⏭️  ${f.nombreEmpresa} (ya existe)`);
    }
  }

  const tipos = ["Router", "Switch", "Teléfono", "Impresora", "Computadora", "Firewall"];
  for (const tipo of tipos) {
    await prisma.tipoDispositivo.upsert({
      where: { nombre: tipo },
      update: {},
      create: { nombre: tipo },
    });
  }

  console.log("✅ Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });