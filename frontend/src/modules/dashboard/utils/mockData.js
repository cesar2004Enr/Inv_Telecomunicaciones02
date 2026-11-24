export const generateMockData = () => {
  const equipos = [
    "Router Cisco A1",
    "Switch Catalyst",
    "Firewall FortiGate",
    "Access Point",
    "Servidor Dell",
    "Switch Cisco",
    "PC Contabilidad",
    "Switch PoE",
    "Router MicroTik",
  ];
  const sitios = ["Piso 1", "Piso 2", "Planta baja"];
  const marcas = ["Cisco", "HP", "Dell", "Fortinet", "TP-Link"];

  return Array.from({ length: 10 }, (_, i) => ({
    id: `00${i + 1}`,
    nombre: equipos[i] || "Equipo Genérico",
    ipv4: `192.168.1.${Math.floor(Math.random() * 254)}`,
    marca: marcas[Math.floor(Math.random() * marcas.length)],
    serie: `SN-${Math.random().toString(36).substring(2, 11).toUpperCase()}`,
    sitio: sitios[Math.floor(Math.random() * sitios.length)],
    funcionamiento: Math.random() > 0.5 ? "Activo" : "Inactivo",
  }));
};
