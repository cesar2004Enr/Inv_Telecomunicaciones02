import { useState, useEffect } from "react";
import api from "../../../shared/services/api";
import OctetInput from "../../equipos/components/OctetInput";
import ScanTable from "../components/ScanTable";
import styles from "../styles/escaneo.module.css";

const ScanPage = () => {
  const [ipInicio, setIpInicio] = useState("");
  const [ipFin, setIpFin] = useState("");
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [adding, setAdding] = useState(false);
  const [notification, setNotification] = useState(null);

  const [fiscalias, setFiscalias] = useState([]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    const loadFiscalias = async () => {
      try {
        const response = await api.getFiscalias();
        setFiscalias(response.data || []);
      } catch (err) {
        console.error("Error al cargar fiscalías:", err);
      }
    };
    loadFiscalias();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleStartScan = async () => {
    if (!ipInicio || !ipFin) {
      showNotification("error", "Ingrese IP de inicio y fin");
      return;
    }

    setScanning(true);
    setResults([]);
    setSelected([]);
    showNotification("info", `Escaneando rango ${ipInicio} - ${ipFin}...`);

    try {
      const response = await api.scanRange(ipInicio, ipFin);
      const data = response.data || [];
      setResults(data);
      showNotification("success", `Escaneo completado: ${data.length} IPs escaneadas (${data.filter(r => r.activo).length} activos)`);
    } catch (err) {
      showNotification("error", err.message || "Error en el escaneo");
    } finally {
      setScanning(false);
    }
  };

  const handleStopScan = () => {
    setScanning(false);
    showNotification("info", "Escaneo detenido");
  };

  const handleSelectAll = () => {
    const activos = results.filter((r) => r.activo);
    setSelected(selected.length === activos.length ? [] : activos.map((r) => r.ip));
  };

  const handleSelectOne = (ip) => {
    setSelected((prev) => (prev.includes(ip) ? prev.filter((i) => i !== ip) : [...prev, ip]));
  };

  const handleOpenLocationModal = () => {
    if (selected.length === 0) return;
    setIsLocationModalOpen(true);
  };

  const confirmAddDevices = async () => {
    setIsLocationModalOpen(false);
    setAdding(true);
    let added = 0;

    for (const ip of selected) {
      const device = results.find((r) => r.ip === ip);
      if (!device?.activo) continue;

      try {
        await api.addEquipment({
          tipo: device.tipoDetectado || "Router",
          nombreEquipo: device.hostname || `Dispositivo ${ip}`,
          direccionIpv4: ip,
          mascaraSubred: "255.255.255.0",
          direccionMac: device.mac || "",
          marca: device.fabricante || "",
          modelo: device.sistemaOperativo || "",
          sitio: selectedLocation, 
        });
        added++;
      } catch (err) {
        console.error(`Error al agregar ${ip}:`, err.message);
      }
    }

    showNotification("success", `${added} dispositivos agregados al inventario`);
    setSelected([]);
    setAdding(false);
    setSelectedLocation(""); 
  };

  const activos = results.filter(r => r.activo).length;
  const inactivos = results.filter(r => !r.activo).length;

  return (
    <div className={styles.contenedorPagina}>
      {notification && (
        <div className={`${styles.toast} ${styles[`toast${notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}`]}`}>
          <span>{notification.type === "success" ? "✅" : notification.type === "error" ? "❌" : "🔍"}</span>
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {isLocationModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsLocationModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Ubicación de los Dispositivos</h2>
            <p style={{ textAlign: "center", marginBottom: "15px", color: "#666" }}>
              ¿En qué fiscalía se encuentran los {selected.length} dispositivos seleccionados?
            </p>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Fiscalía (Opcional):</label>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)} 
                className={styles.formInput}
              >
                <option value="">Dejar vacío (Sin ubicación específica)</option>
                {fiscalias.map((f) => (
                  <option key={f.id} value={f.nombreEmpresa}>
                    {f.nombreEmpresa} ({f.ciudad})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.modalButtons}>
              <button type="button" className={styles.cancelButton} onClick={() => setIsLocationModalOpen(false)}>
                Cancelar
              </button>
              <button type="button" className={styles.addButton} onClick={confirmAddDevices}>
                Confirmar y Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.scanControls}>
        <div className={styles.ipInputs}>
          <div className={styles.ipField}>
            <label className={styles.ipLabel}>IP Inicio:</label>
            <OctetInput value={ipInicio} onChange={(e) => setIpInicio(e.target.value)} label="IPv4" />
          </div>
          <span className={styles.ipSeparator}>→</span>
          <div className={styles.ipField}>
            <label className={styles.ipLabel}>IP Fin:</label>
            <OctetInput value={ipFin} onChange={(e) => setIpFin(e.target.value)} label="IPv4" />
          </div>
        </div>

        <div className={styles.scanButtons}>
          <button className={styles.startButton} onClick={handleStartScan} disabled={scanning}>
            <span className="material-symbols-outlined">play_arrow</span>
            Comenzar Escaneo
          </button>
          <button className={styles.stopButton} onClick={handleStopScan} disabled={!scanning}>
            <span className="material-symbols-outlined">stop</span>
            Detener Escaneo
          </button>
          <button className={styles.addButton} onClick={handleOpenLocationModal} disabled={scanning || selected.length === 0 || adding}>
            <span className="material-symbols-outlined">add</span>
            {adding ? "Agregando..." : `Agregar (${selected.length})`}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <>
          <div className={styles.resultsInfo}>
            <span>Total: <strong>{results.length}</strong></span>
            <span>🟢 Activos: <strong>{activos}</strong></span>
            <span>🔴 Inactivos: <strong>{inactivos}</strong></span>
          </div>
          <div className={styles.tableWrapper}>
            <ScanTable data={results} selected={selected} onSelectAll={handleSelectAll} onSelectOne={handleSelectOne} />
          </div>
        </>
      )}

      {scanning && (
        <div className={styles.scanningIndicator}>
          <span className="material-symbols-outlined">radar</span>
          <span>Escaneando red... Esto puede tomar unos minutos</span>
        </div>
      )}
    </div>
  );
};

export default ScanPage;