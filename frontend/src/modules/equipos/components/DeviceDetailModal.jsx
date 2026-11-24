import styles from "../styles/equipos.module.css";

const DeviceDetailModal = ({ isOpen, onClose, device }) => {
  if (!isOpen || !device) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Detalles del Dispositivo</h2>

        <div className={styles.detailContainer}>
          {/* Información General */}
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <span className="material-symbols-outlined">info</span>
              Información General
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Tipo:</span>
                <span className={styles.detailValue}>
                  <span className={styles.deviceTypeBadge}>
                    {device.tipoDispositivo?.nombre || "-"}
                  </span>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Nombre:</span>
                <span className={styles.detailValue}>{device.nombreEquipo || "-"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Nombre de Inventario:</span>
                <span className={styles.detailValue}>{device.nombreInventario || "-"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Modelo:</span>
                <span className={styles.detailValue}>{device.modelo || "-"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>N° de Serie:</span>
                <span className={styles.detailValue}>{device.numeroSerie || "-"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Marca:</span>
                <span className={styles.detailValue}>{device.marca?.nombre || "-"}</span>
              </div>
              {/* CAMPO DE UBICACIÓN / FISCALÍA */}
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Ubicación (Fiscalía):</span>
                <span className={styles.detailValue}>{device.sitio || "-"}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Estado:</span>
                <span className={styles.detailValue}>
                  <span
                    className={`${styles.statusBadge} ${
                      device.actividad === "Activo"
                        ? styles.statusActive
                        : styles.statusInactive
                    }`}
                  >
                    {device.actividad || "-"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Información de Red */}
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <span className="material-symbols-outlined">lan</span>
              Información de Red
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dirección IPv4:</span>
                <span className={styles.detailValue}>
                  {device.interfaces?.[0]?.direccionIpv4 || device.ipv4 || "-"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Máscara de Subred:</span>
                <span className={styles.detailValue}>
                  {device.interfaces?.[0]?.mascaraSubred || device.mascara || "-"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Dirección MAC:</span>
                <span className={styles.detailValue} style={{ fontFamily: "monospace" }}>
                  {device.interfaces?.[0]?.direccionMac || device.mac || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Información de Registro */}
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <span className="material-symbols-outlined">schedule</span>
              Información de Registro
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fecha de Registro:</span>
                <span className={styles.detailValue}>{formatDate(device.fechaRegistro)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Última Actualización:</span>
                <span className={styles.detailValue} style={{ color: device.fechaActualizacion ? "#2e7d32" : "#888" }}>
                  {formatDate(device.fechaActualizacion)}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>ID del Dispositivo:</span>
                <span className={styles.detailValue} style={{ fontFamily: "monospace", fontSize: "11px" }}>
                  {device.id || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Usuario y Fiscalía */}
          <div className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <span className="material-symbols-outlined">person</span>
              Responsable
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Registrado por:</span>
                <span className={styles.detailValue}>
                  {device.datosUsuario
                    ? `${device.datosUsuario.primerNombre || ""} ${device.datosUsuario.apellidoPaterno || ""}`
                    : "-"}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Fiscalía del usuario:</span>
                <span className={styles.detailValue}>
                  {device.fiscalia?.nombreEmpresa || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalButtons}>
          <button type="button" className={styles.cancelButton} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceDetailModal;