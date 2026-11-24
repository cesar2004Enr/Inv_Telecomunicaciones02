const prisma = require("../config/prisma");
const { exec } = require("child_process");
const { parseString } = require("xml2js");
const snmp = require("net-snmp");
const util = require("util");
const execPromise = util.promisify(exec);

const SNMP_OIDS = {
  sysName: "1.3.6.1.2.1.1.5.0",
  sysDescr: "1.3.6.1.2.1.1.1.0",
  sysObjectID: "1.3.6.1.2.1.1.2.0",
  sysServices: "1.3.6.1.2.1.1.7.0",
};

const snmpGet = (ip, community, oids) => {
  return new Promise((resolve, reject) => {
    const session = snmp.createSession(ip, community, { timeout: 3000, retries: 0 });
    session.get(oids, (error, varbinds) => {
      session.close();
      if (error) { reject(error); return; }
      const result = {};
      varbinds.forEach((vb) => {
        const key = Object.keys(SNMP_OIDS).find((k) => SNMP_OIDS[k] === vb.oid);
        if (key && vb.value != null) result[key] = vb.value.toString();
      });
      resolve(result);
    });
  });
};

const scanSNMP = async (ip) => {
  const communities = ["public", "private", "admin", "cisco", "snmp", "default"];
  for (const c of communities) {
    try {
      const r = await snmpGet(ip, c, Object.values(SNMP_OIDS));
      if (Object.keys(r).length > 0) return r;
    } catch {}
  }
  return null;
};

const detectDeviceType = (scanData) => {
  const { puertosAbiertos = [], mac = "", snmpDescr = "", osMatch = "", hostname = "", ttl = 0 } = scanData;
  const puertos = puertosAbiertos.map((p) => p.puerto);
  const servicios = puertosAbiertos.map((p) => p.servicio?.toLowerCase() || "");

  const osLower = osMatch.toLowerCase();
  
  if (osLower.includes("ios") || osLower.includes("router") || osLower.includes("cisco") ||
      osLower.includes("junos") || osLower.includes("mikrotik") || osLower.includes("routeros") ||
      osLower.includes("openwrt") || osLower.includes("dd-wrt") || osLower.includes("tomato")) {
    return "Router";
  }

  if (osLower.includes("switch") || osLower.includes("catalyst") || osLower.includes("procurve") ||
      osLower.includes("aruba") || osLower.includes("brocade")) {
    return "Switch";
  }

  if (
    osLower.includes("fortigate") || 
    osLower.includes("palo alto") || 
    osLower.includes("firewall") || 
    osLower.includes("pfsense") ||
    osLower.includes("sonicwall") || 
    osLower.includes("sonicos") 
  ) {
    return "Firewall";
  }

  if (osLower.includes("printer") || osLower.includes("jetdirect") || osLower.includes("laserjet") ||
      osLower.includes("deskjet") || osLower.includes("officejet") || osLower.includes("xerox") ||
      osLower.includes("brother") || osLower.includes("epson") || osLower.includes("canon")) {
    return "Impresora";
  }

  if (osLower.includes("voip") || osLower.includes("sip") || osLower.includes("polycom") ||
      osLower.includes("grandstream") || osLower.includes("yealink") || osLower.includes("avaya") ||
      osLower.includes("cisco phone") || osLower.includes("unifi talk")) {
    return "Teléfono";
  }

  if (osLower.includes("windows") || osLower.includes("linux") || osLower.includes("ubuntu") ||
      osLower.includes("debian") || osLower.includes("centos") || osLower.includes("mac os") ||
      osLower.includes("macos") || osLower.includes("fedora") || osLower.includes("red hat")) {
    return "Computadora";
  }

  if (puertos.includes("5060") || puertos.includes("5061") || puertos.includes("2000") ||
      servicios.some((s) => s.includes("sip") || s.includes("voip"))) {
    return "Teléfono";
  }

  if (puertos.includes("515") || puertos.includes("631") || puertos.includes("9100") ||
      servicios.some((s) => s.includes("printer") || s.includes("ipp") || s.includes("jetdirect"))) {
    return "Impresora";
  }

  if ((puertos.includes("443") || puertos.includes("4444") || puertos.includes("4433")) && puertos.includes("22") && !puertos.includes("80")) {
    return "Firewall";
  }

  if (puertos.includes("161") && puertos.includes("22") && !puertos.includes("80")) {
    return "Switch";
  }

  if ((puertos.includes("80") || puertos.includes("443")) && 
      (puertos.includes("22") || puertos.includes("23")) &&
      puertos.includes("161")) {
    return "Router";
  }

  if (ttl > 0) {
    if (ttl <= 64) return "Computadora";  
    if (ttl <= 128) return "Computadora"; 
    if (ttl <= 255) return "Router";     
  }

  if (mac) {
    const prefix = mac.substring(0, 8).toUpperCase();
    
    const routerVendors = ["00:1A:70", "D8:5D:4C", "C0:3F:0E", "00:25:9C", "E8:DE:27", "00:18:39", "00:1F:33"];
    const switchVendors = ["00:1B:63", "00:23:04", "00:0D:65", "00:1F:9E", "00:17:94", "00:1E:F7"];
    const printerVendors = ["00:1B:78", "00:21:B7", "3C:D9:2B", "00:1E:0B", "00:17:08", "00:20:6B"];
    const phoneVendors = ["00:15:65", "00:0F:34", "00:04:F2", "64:16:66", "00:07:3F"];
    const firewallVendors = ["C0:EA:E4", "00:17:C5", "00:06:5B", "18:B1:69", "00:1B:8F"]; // SonicWall, Palo Alto, etc.
    
    if (firewallVendors.some((v) => mac.startsWith(v))) return "Firewall";
    if (routerVendors.some((v) => mac.startsWith(v))) return "Router";
    if (switchVendors.some((v) => mac.startsWith(v))) return "Switch";
    if (printerVendors.some((v) => mac.startsWith(v))) return "Impresora";
    if (phoneVendors.some((v) => mac.startsWith(v))) return "Teléfono";
  }

  if (snmpDescr) {
    const d = snmpDescr.toLowerCase();
    if (d.includes("sonicwall") || d.includes("sonicos")) return "Firewall";
    if (d.includes("router") || d.includes("gateway") || d.includes("ios")) return "Router";
    if (d.includes("switch") || d.includes("bridge") || d.includes("catalyst")) return "Switch";
    if (d.includes("printer") || d.includes("laserjet") || d.includes("deskjet") || d.includes("mfp")) return "Impresora";
    if (d.includes("phone") || d.includes("voip") || d.includes("sip") || d.includes("ipphone")) return "Teléfono";
    if (d.includes("windows") || d.includes("linux") || d.includes("ubuntu") || d.includes("server")) return "Computadora";
  }

  if (hostname) {
    const h = hostname.toLowerCase();
    if (h.includes("firewall") || h.includes("fw-") || h.includes("sonicwall")) return "Firewall";
    if (h.includes("router") || h.includes("gw") || h.includes("gateway") || h.includes("ap-")) return "Router";
    if (h.includes("sw") || h.includes("switch") || h.includes("sw-")) return "Switch";
    if (h.includes("prn") || h.includes("printer") || h.includes("imp") || h.includes("print")) return "Impresora";
    if (h.includes("phone") || h.includes("voip") || h.includes("sip") || h.includes("tel-")) return "Teléfono";
    if (h.includes("pc") || h.includes("desktop") || h.includes("laptop") || h.includes("nb-") || h.includes("ws-")) return "Computadora";
  }

  // Por defecto
  return "Computadora";
};

const scanDevice = async (ipAddress) => {
  let result = {
    activo: false,
    hostname: "",
    mac: "",
    fabricante: "",
    sistemaOperativo: "",
    osMatch: "",
    modelo: "",
    tipoDetectado: null,
    puertosAbiertos: [],
    ttl: 0,
  };

  try {
    const { stdout: pingOut } = await execPromise(`ping -c 1 -W 2 ${ipAddress}`, { timeout: 3000 });
    result.activo = true;
    
    const ttlMatch = pingOut.match(/ttl=(\d+)/i);
    if (ttlMatch) {
      result.ttl = parseInt(ttlMatch[1]);
    }
  } catch {
    result.tipoDetectado = "Computadora";
    return result;
  }

  try {
    let nmapCmd = `sudo nmap -O --osscan-guess -sV --version-intensity 5 ${ipAddress} -oX -`;
    let nmapResult;
    
    try {
      nmapResult = await execPromise(nmapCmd, { timeout: 60000 });
    } catch {
      nmapCmd = `nmap -O --osscan-guess -sV ${ipAddress} -oX -`;
      try {
        nmapResult = await execPromise(nmapCmd, { timeout: 60000 });
      } catch {
        try {
          nmapCmd = `nmap -sn ${ipAddress} -oX -`;
          nmapResult = await execPromise(nmapCmd, { timeout: 15000 });
        } catch {}
      }
    }

    if (nmapResult?.stdout) {
      parseString(nmapResult.stdout, (err, parsed) => {
        if (err || !parsed?.nmaprun) return;
        const host = parsed.nmaprun.host?.[0];
        if (!host) return;

        const os = host.os?.[0];
        if (os) {
          const bestMatch = os.osmatch?.[0];
          if (bestMatch) {
            result.osMatch = bestMatch.$.name || "";
            result.sistemaOperativo = result.osMatch;
          }

          const osClass = bestMatch?.osclass?.[0];
          if (osClass) {
            result.modelo = result.modelo || osClass.$.osgen || "";
          }
        }

        result.hostname = host.hostnames?.[0]?.hostname?.[0]?.$.name || "";

        host.address?.forEach((a) => {
          if (a.$.addrtype === "mac") {
            result.mac = (a.$.addr || "").toUpperCase();
            result.fabricante = a.$.vendor || "";
          }
        });

        host.ports?.[0]?.port?.forEach((p) => {
          if (p.state?.[0]?.$.state === "open") {
            result.puertosAbiertos.push({
              puerto: p.$.portid,
              protocolo: p.$.protocol || "tcp",
              servicio: p.service?.[0]?.$.name || "",
              producto: p.service?.[0]?.$.product || "",
              version: p.service?.[0]?.$.version || "",
            });
          }
        });
      });
    }
  } catch (err) {}

  if (!result.mac) {
    try {
      const { stdout: arpOut } = await execPromise(`arp -n ${ipAddress}`, { timeout: 3000 });
      const m = arpOut.match(/([0-9A-Fa-f:]{17})/);
      if (m) {
        result.mac = m[1].toUpperCase();
      }
    } catch {
      try {
        const { stdout: arpScanOut } = await execPromise(`arp-scan ${ipAddress} 2>/dev/null`, { timeout: 5000 });
        const m = arpScanOut.match(/([0-9A-Fa-f:]{17})/);
        if (m) {
          result.mac = m[1].toUpperCase();
        }
      } catch {}
    }
  }

  try {
    const snmpResult = await scanSNMP(ipAddress);
    if (snmpResult) {
      result.hostname = result.hostname || snmpResult.sysName || "";
      result.modelo = result.modelo || snmpResult.sysDescr?.split(",")[0]?.trim() || "";
    }
  } catch {}

  // 5. DETECCIÓN DE TIPO
  result.tipoDetectado = detectDeviceType({
    puertosAbiertos: result.puertosAbiertos,
    mac: result.mac,
    snmpDescr: result.modelo,
    osMatch: result.osMatch,
    hostname: result.hostname,
    ttl: result.ttl,
  });

  return result;
};

const addEquipment = async (data, userId) => {
  const safeData = {
    tipo: data.tipo || "",
    nombreEquipo: data.nombreEquipo || "",
    nombreInventario: data.nombreInventario || "",
    modelo: data.modelo || "",
    numeroSerie: data.numeroSerie || "",
    direccionIpv4: data.direccionIpv4 || "0.0.0.0",
    mascaraSubred: data.mascaraSubred || "255.255.255.0",
    direccionMac: data.direccionMac || "",
    marca: data.marca || "",
    sitio: data.sitio || "",
  };

  let scanResult;
  try {
    scanResult = await scanDevice(safeData.direccionIpv4);
  } catch {
    scanResult = { activo: false, hostname: "", mac: "", fabricante: "", sistemaOperativo: "", modelo: "", tipoDetectado: null, puertosAbiertos: [] };
  }

  const macAddress = scanResult.mac || safeData.direccionMac || "";
  const nombreEquipo = safeData.nombreEquipo || scanResult.hostname || `Dispositivo ${safeData.direccionIpv4}`;
  const modelo = safeData.modelo || scanResult.modelo || scanResult.sistemaOperativo || "";
  const actividad = scanResult.activo ? "Activo" : "Inactivo";

  if (macAddress && macAddress !== "00:00:00:00:00:00" && !macAddress.startsWith("FF:FF:FF")) {
    const existing = await prisma.interfaz.findFirst({
      where: { direccionMac: macAddress, dispositivo: { datosUsuarioId: userId } },
      include: { dispositivo: true },
    });
    if (existing) throw new Error(`MAC ${macAddress} ya registrada en "${existing.dispositivo.nombreEquipo}"`);
  }

  const marcaNombre = safeData.marca || scanResult.fabricante || "Desconocida";
  let marca = await prisma.marca.upsert({ where: { nombre: marcaNombre }, update: {}, create: { nombre: marcaNombre } });

  const tipoFinal = safeData.tipo || scanResult.tipoDetectado || "Computadora";
  let tipo = await prisma.tipoDispositivo.findFirst({ where: { nombre: tipoFinal } });
  if (!tipo) tipo = await prisma.tipoDispositivo.create({ data: { nombre: tipoFinal } });

  const usuario = await prisma.datosUsuario.findUnique({ where: { id: userId }, select: { fiscaliaId: true } });

  const dispositivo = await prisma.dispositivo.create({
    data: {
      nombreEquipo, 
      nombreInventario: safeData.nombreInventario || null, 
      modelo, 
      numeroSerie: safeData.numeroSerie, 
      actividad, 
      sitio: safeData.sitio,
      datosUsuarioId: userId, 
      fiscaliaId: usuario?.fiscaliaId || null,
      marcaId: marca.id, 
      tipoDispositivoId: tipo.id,
    },
  });

  await prisma.interfaz.create({
    data: {
      direccionIpv4: safeData.direccionIpv4, 
      mascaraSubred: safeData.mascaraSubred,
      direccionMac: macAddress || "00:00:00:00:00:00", 
      dispositivoId: dispositivo.id,
    },
  });

  return await prisma.dispositivo.findUnique({
    where: { id: dispositivo.id }, 
    include: { marca: true, tipoDispositivo: true, interfaces: true },
  });
};

const updateEquipment = async (id, data, userId) => {
  const existing = await prisma.dispositivo.findFirst({ where: { id, datosUsuarioId: userId } });
  if (!existing) throw new Error("Dispositivo no encontrado");
  
  if (data.direccionMac && data.direccionMac !== "00:00:00:00:00:00") {
    const dup = await prisma.interfaz.findFirst({ where: { direccionMac: data.direccionMac, dispositivoId: { not: id } }, include: { dispositivo: true } });
    if (dup) throw new Error(`MAC ${data.direccionMac} ya registrada en "${dup.dispositivo.nombreEquipo}"`);
  }

  let marca = null; 
  if (data.marca) marca = await prisma.marca.upsert({ where: { nombre: data.marca }, update: {}, create: { nombre: data.marca } });
  
  let tipo = await prisma.tipoDispositivo.findFirst({ where: { nombre: data.tipo } }); 
  if (!tipo) tipo = await prisma.tipoDispositivo.create({ data: { nombre: data.tipo } });
  
  await prisma.dispositivo.update({ 
    where: { id }, 
    data: { 
      nombreEquipo: data.nombreEquipo || existing.nombreEquipo, 
      nombreInventario: data.nombreInventario !== undefined ? data.nombreInventario : existing.nombreInventario,
      modelo: data.modelo !== undefined ? data.modelo : existing.modelo, 
      numeroSerie: data.numeroSerie !== undefined ? data.numeroSerie : existing.numeroSerie, 
      sitio: data.sitio !== undefined ? data.sitio : existing.sitio,
      marcaId: marca?.id || existing.marcaId, 
      tipoDispositivoId: tipo.id 
    } 
  });

  if (data.direccionIpv4) {
    const iface = await prisma.interfaz.findFirst({ where: { dispositivoId: id } });
    if (iface) {
      await prisma.interfaz.update({ 
        where: { id: iface.id }, 
        data: { 
          direccionIpv4: data.direccionIpv4, 
          mascaraSubred: data.mascaraSubred || iface.mascaraSubred, 
          direccionMac: data.direccionMac || iface.direccionMac 
        } 
      });
    } else {
      await prisma.interfaz.create({ 
        data: { 
          direccionIpv4: data.direccionIpv4, 
          mascaraSubred: data.mascaraSubred || "255.255.255.0", 
          direccionMac: data.direccionMac || "00:00:00:00:00:00", 
          dispositivoId: id 
        } 
      });
    }
  }

  return await prisma.dispositivo.findUnique({ where: { id }, include: { marca: true, tipoDispositivo: true, interfaces: true } });
};

const buildSearchConditions = (searchTerm) => {
  if (!searchTerm?.trim()) return {};
  const t = searchTerm.trim();
  return { OR: [
    { nombreEquipo: { contains: t, mode: "insensitive" } }, 
    { nombreInventario: { contains: t, mode: "insensitive" } },
    { modelo: { contains: t, mode: "insensitive" } }, 
    { numeroSerie: { contains: t, mode: "insensitive" } },
    { actividad: { contains: t, mode: "insensitive" } }, 
    { marca: { nombre: { contains: t, mode: "insensitive" } } }, 
    { tipoDispositivo: { nombre: { contains: t, mode: "insensitive" } } },
    { interfaces: { some: { OR: [{ direccionIpv4: { contains: t } }, { mascaraSubred: { contains: t } }, { direccionMac: { contains: t, mode: "insensitive" } }] } } },
  ]};
};

const getEquipmentByType = async (tipoNombre, userId, searchTerm) => {
  const tipo = await prisma.tipoDispositivo.findFirst({ where: { nombre: tipoNombre } });
  if (!tipo) return [];
  return await prisma.dispositivo.findMany({
    where: { datosUsuarioId: userId, tipoDispositivoId: tipo.id, ...buildSearchConditions(searchTerm) },
    include: { marca: true, tipoDispositivo: true, interfaces: true, datosUsuario: true, fiscalia: true },
    orderBy: { fechaRegistro: "desc" },
  });
};

const getAllEquipment = async (userId, searchTerm) => {
  return await prisma.dispositivo.findMany({
    where: { datosUsuarioId: userId, ...buildSearchConditions(searchTerm) },
    include: { marca: true, tipoDispositivo: true, interfaces: true, datosUsuario: true, fiscalia: true },
    orderBy: { fechaRegistro: "desc" },
  });
};

const deleteEquipment = async (tipo, ids, userId) => {
  return await prisma.dispositivo.deleteMany({ where: { id: { in: ids }, datosUsuarioId: userId } });
};

module.exports = { addEquipment, updateEquipment, getEquipmentByType, getAllEquipment, deleteEquipment };