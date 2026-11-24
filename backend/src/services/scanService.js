const { exec } = require("child_process");
const { parseString } = require("xml2js");
const util = require("util");
const execPromise = util.promisify(exec);

const scanRange = async (ipInicio, ipFin) => {
  const ipToNum = (ip) =>
    ip.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct), 0);
  const numToIp = (num) =>
    [(num >>> 24) & 255, (num >>> 16) & 255, (num >>> 8) & 255, num & 255].join(
      ".",
    );

  const start = ipToNum(ipInicio);
  const end = ipToNum(ipFin);

  const totalIps = end - start + 1;
  if (totalIps > 65536) {
    throw new Error("Rango demasiado grande. Máximo 65536 IPs.");
  }

  console.log(`\n🔍 INICIANDO ESCANEO DE RANGO:`);
  console.log(`📡 Desde: ${ipInicio}`);
  console.log(`📡 Hasta: ${ipFin}`);
  console.log(`📡 Total IPs a escanear: ${totalIps}\n`);

  const ips = [];
  for (let i = start; i <= end; i++) {
    ips.push(numToIp(i));
  }

  const results = [];
  const batchSize = 20;

  for (let i = 0; i < ips.length; i += batchSize) {
    const batch = ips.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map((ip) => scanSingleIP(ip)));
    results.push(...batchResults);

    const scanned = Math.min(i + batchSize, ips.length);
    const activos = results.filter((r) => r.activo).length;
    console.log(
      `📡 Progreso: ${scanned}/${ips.length} IPs | Activos: ${activos}`,
    );
  }

  console.log(`\n✅ ESCANEO COMPLETADO:`);
  console.log(`📊 Total IPs: ${results.length}`);
  console.log(`🟢 Activos: ${results.filter((r) => r.activo).length}`);
  console.log(`🔴 Inactivos: ${results.filter((r) => !r.activo).length}\n`);

  return results;
};

const scanSingleIP = async (ip) => {
  const result = {
    ip,
    activo: false,
    hostname: "",
    mac: "",
    fabricante: "",
    puertosAbiertos: [],
    tipoDetectado: null,
    sistemaOperativo: "",
  };

  try {
    await execPromise(`ping -c 1 -W 1 ${ip}`, { timeout: 2000 });
    result.activo = true;
  } catch {}

  if (result.activo) {
    try {
      const { stdout } = await execPromise(
        `nmap -sn -O ${ip} -oX - 2>/dev/null`,
        { timeout: 10000 },
      );

      parseString(stdout, (err, parsed) => {
        if (err || !parsed?.nmaprun) return;
        const host = parsed.nmaprun.host?.[0];
        if (!host) return;

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
              servicio: p.service?.[0]?.$.name || "desconocido",
            });
          }
        });

        const os = host.os?.[0]?.osmatch?.[0];
        if (os) result.sistemaOperativo = os.$.name || "";
      });
    } catch {}

    if (!result.mac) {
      try {
        const { stdout: arpOut } = await execPromise(`arp -n ${ip}`, {
          timeout: 3000,
        });
        const match = arpOut.match(/([0-9A-Fa-f:]{17})/);
        if (match) {
          result.mac = match[1].toUpperCase();
        }
      } catch {}
    }

    result.tipoDetectado = detectDeviceType(
      result.puertosAbiertos,
      result.mac,
      result.hostname,
    );
  }

  return result;
};

const detectDeviceType = (puertos, mac, hostname) => {
  const puertosList = puertos.map((p) => p.puerto);

  if (puertosList.includes("5060") || puertosList.includes("5061"))
    return "Teléfono";
  if (
    puertosList.includes("515") ||
    puertosList.includes("631") ||
    puertosList.includes("9100")
  )
    return "Impresora";
  if (
    (puertosList.includes("80") || puertosList.includes("443")) &&
    puertosList.includes("22")
  )
    return "Router";
  if (
    puertosList.includes("161") &&
    (puertosList.includes("22") || puertosList.includes("23"))
  )
    return "Switch";
  if (
    puertosList.includes("445") ||
    puertosList.includes("3389") ||
    puertosList.includes("135")
  )
    return "Computadora";

  if (mac) {
    const prefix = mac.substring(0, 8).toUpperCase();
    if (
      ["00:1A:70", "D8:5D:4C", "C0:3F:0E", "00:25:9C", "E8:DE:27"].some((m) =>
        mac.startsWith(m),
      )
    )
      return "Router";
    if (["00:1B:63", "00:23:04", "00:0D:65"].some((m) => mac.startsWith(m)))
      return "Switch";
  }

  if (hostname) {
    const h = hostname.toLowerCase();
    if (h.includes("router") || h.includes("gateway")) return "Router";
    if (h.includes("switch")) return "Switch";
    if (h.includes("printer") || h.includes("hp")) return "Impresora";
    if (h.includes("phone") || h.includes("voip")) return "Teléfono";
  }

  return null;
};

module.exports = { scanRange };
