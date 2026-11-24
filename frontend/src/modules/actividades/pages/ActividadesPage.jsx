import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../../shared/services/api";
import DeviceDetailModal from "../../equipos/components/DeviceDetailModal";
import styles from "../styles/actividades.module.css";

const COLUMNS = [
  { key: "tipoDispositivo", label: "Tipo" },
  { key: "nombreEquipo", label: "Nombre" },
  { key: "interfaces", label: "IPv4" },
  { key: "marca", label: "Marca" },
  { key: "fechaRegistro", label: "Fecha" },
  { key: "actividad", label: "Estado" },
];

const ActividadesPage = () => {
  const { searchTerm } = useOutletContext();
  const [inactiveDevices, setInactiveDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchDevices = async () => {
      try {
        const response = await api.getAllEquipment(searchTerm || "");
        if (!cancelled) {
          const formatted = (response.data || [])
            .filter((d) => d.actividad === "Inactivo")
            .map((d) => ({
              ...d,
              ipv4: d.interfaces?.[0]?.direccionIpv4 || "-",
            }));
          setInactiveDevices(formatted);
        }
      } catch (err) {
        if (!cancelled) console.error("Error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchDevices();
    return () => {
      cancelled = true;
    };
  }, [searchTerm]);

  const handleInfoClick = (device) => {
    setSelectedDevice(device);
    setIsDetailModalOpen(true);
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleDateString("es-MX", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      : "";

  if (loading) {
    return (
      <div className={styles.contenedorPagina}>
        <div className={styles.loadingContainer}>
          <p>Cargando actividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contenedorPagina}>

      {searchTerm && searchTerm.trim() && (
        <div className={styles.searchInfo}>
          <span className="material-symbols-outlined">search</span>
          <span>
            Resultados para: <strong>{searchTerm}</strong> (
            {inactiveDevices.length} encontrados)
          </span>
        </div>
      )}

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Equipos Inactivos</div>
          <div className={styles.statNumber}>{inactiveDevices.length}</div>
          <span
            className="material-symbols-outlined"
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              color: "#c62828",
              fontSize: "24px",
            }}
          >
            warning
          </span>
        </div>
      </div>

      {inactiveDevices.length === 0 ? (
        <div className={styles.emptyTable}>
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "60px",
              color: searchTerm ? "#ff9800" : "#4caf50",
            }}
          >
            {searchTerm ? "search_off" : "check_circle"}
          </span>
          <p>
            {searchTerm
              ? "No se encontraron dispositivos inactivos con ese criterio"
              : "Todos los dispositivos están activos"}
          </p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {COLUMNS.map((c) => (
                    <th key={c.key}>{c.label}</th>
                  ))}
                  <th style={{ width: "40px", textAlign: "center" }}>Info</th>
                </tr>
              </thead>
              <tbody>
                {inactiveDevices.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={styles.deviceType}>
                        {item.tipoDispositivo?.nombre || "-"}
                      </span>
                    </td>
                    <td>{item.nombreEquipo}</td>
                    <td>{item.ipv4 || "-"}</td>
                    <td>{item.marca?.nombre || "-"}</td>
                    <td>{formatDate(item.fechaRegistro)}</td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${styles.statusInactive}`}
                      >
                        {item.actividad}
                      </span>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <span
                        className="material-symbols-outlined"
                        style={{
                          cursor: "pointer",
                          color: "#666",
                          fontSize: "20px",
                        }}
                        onClick={() => handleInfoClick(item)}
                      >
                        info
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <DeviceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        device={selectedDevice}
      />
    </div>
  );
};

export default ActividadesPage;
