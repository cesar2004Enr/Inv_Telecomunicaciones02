import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../../shared/services/api";
import ActionBar from "../../equipos/components/ActionBar";
import EditDeviceModal from "../../equipos/components/EditDeviceModal";
import DeviceDetailModal from "../../equipos/components/DeviceDetailModal";
import styles from "../styles/dashboard.module.css";

const DASHBOARD_COLUMNS = [
  { key: "tipoDispositivo", label: "Tipo" },
  { key: "nombreEquipo", label: "Nombre" },
  { key: "nombreInventario", label: "Inventario" },
  { key: "interfaces", label: "IPv4" },
  { key: "marca", label: "Marca" },
  { key: "fechaRegistro", label: "Fecha" },
  { key: "actividad", label: "Estado" },
];

const DashboardHome = () => {
  const { searchTerm, refreshKey } = useOutletContext();
  const [allDevices, setAllDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const response = await api.getAllEquipment(searchTerm || "");
        if (!cancelled) {
          // YA NO FILTRAMOS POR ACTIVO AQUÍ
          const formatted = (response.data || []).map((d) => ({
            ...d,
            ipv4: d.interfaces?.[0]?.direccionIpv4 || "",
          }));
          setAllDevices(formatted);
        }
      } catch (err) {
        if (!cancelled) console.error("Error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [searchTerm, refreshKey]);

  const reloadDevices = async () => {
    const response = await api.getAllEquipment(searchTerm || "");
    const formatted = (response.data || []).map((d) => ({
      ...d,
      ipv4: d.interfaces?.[0]?.direccionIpv4 || "",
    }));
    setAllDevices(formatted);
  };

  const handleSelectAll = () => {
    setSelectedDevices(selectedDevices.length === allDevices.length ? [] : allDevices.map((d) => d.id));
  };

  const handleSelectOne = (id) => {
    setSelectedDevices((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleDelete = async () => {
    if (selectedDevices.length === 0) return;
    if (!confirm(`¿Eliminar ${selectedDevices.length}?`)) return;
    try {
      setDeleting(true);
      const grouped = {};
      selectedDevices.forEach((id) => {
        const device = allDevices.find((d) => d.id === id);
        if (device) {
          const tipo = device.tipoDispositivo?.nombre || "Router";
          if (!grouped[tipo]) grouped[tipo] = [];
          grouped[tipo].push(id);
        }
      });
      for (const [tipo, ids] of Object.entries(grouped)) {
        await api.deleteEquipment(tipo, ids);
      }
      setSelectedDevices([]);
      reloadDevices();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    if (selectedDevices.length !== 1) { alert("Seleccione un solo dispositivo"); return; }
    const device = allDevices.find((d) => d.id === selectedDevices[0]);
    if (device) { setEditingDevice(device); setIsEditModalOpen(true); }
  };

  const handleDeviceUpdated = () => {
    setIsEditModalOpen(false);
    setEditingDevice(null);
    setSelectedDevices([]);
    reloadDevices();
  };

  const handleInfoClick = (device) => { setSelectedDevice(device); setIsDetailModalOpen(true); };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("es-MX", { year: "numeric", month: "2-digit", day: "2-digit" }) : "";

  if (loading) {
    return <div className={styles.loadingContainer}><p>Cargando inventario...</p></div>;
  }

  // Cálculos para las tarjetas
  const totalEquipos = allDevices.length;
  const equiposActivos = allDevices.filter((d) => d.actividad === "Activo").length;

  return (
    <div className={styles.dashboardHomeContainer}>
      <ActionBar selectedCount={selectedDevices.length} onDelete={handleDelete} onArchive={() => {}} onEdit={handleEdit} loading={deleting} />
      
      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.bgAzul}`}>
          <div className={styles.statLabel}>Total equipos</div>
          <div className={styles.statNumber}>{totalEquipos}</div>
        </div>
        <div className={`${styles.statCard} ${styles.bgVerde}`}>
          <div className={styles.statLabel}>Activos</div>
          <div className={styles.statNumber}>{equiposActivos}</div>
        </div>
        <div className={`${styles.statCard} ${styles.bgRojo}`}>
          <div className={styles.statLabel}>Inactivos</div>
          <div className={styles.statNumber}>{totalEquipos - equiposActivos}
          </div>
        </div>
      </div>

      {searchTerm && <div className={styles.searchInfo}>🔍 <strong>{searchTerm}</strong> ({allDevices.length})</div>}
      
      {allDevices.length === 0 ? (
        <div className={styles.emptyTable}><span className="material-symbols-outlined" style={{ fontSize: "60px", color: "#ccc" }}>inventory_2</span><p>No hay dispositivos registrados</p></div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "40px", textAlign: "center" }}><input type="checkbox" onChange={handleSelectAll} checked={allDevices.length > 0 && selectedDevices.length === allDevices.length} className={styles.checkbox} /></th>
                {DASHBOARD_COLUMNS.map((c) => <th key={c.key}>{c.label}</th>)}
                <th style={{ width: "40px" }}>Info</th>
              </tr>
            </thead>
            <tbody>
              {allDevices.map((item) => (
                <tr key={item.id} className={selectedDevices.includes(item.id) ? styles.selectedRow : ""}>
                  <td style={{ textAlign: "center" }}><input type="checkbox" checked={selectedDevices.includes(item.id)} onChange={() => handleSelectOne(item.id)} className={styles.checkbox} /></td>
                  <td><span className={styles.deviceType}>{item.tipoDispositivo?.nombre || "-"}</span></td>
                  <td>{item.nombreEquipo}</td>
                  <td>{item.nombreInventario || "-"}</td>
                  <td>{item.ipv4 || "-"}</td>
                  <td>{item.marca?.nombre || "-"}</td>
                  <td>{formatDate(item.fechaRegistro)}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${item.actividad === "Activo" ? styles.statusActive : styles.statusInactive}`}>
                      {item.actividad}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}><span className="material-symbols-outlined" style={{ cursor: "pointer", color: "#666", fontSize: "20px" }} onClick={() => handleInfoClick(item)}>info</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <EditDeviceModal key={editingDevice?.id || "new"} isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onDeviceUpdated={handleDeviceUpdated} device={editingDevice} />
      <DeviceDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} device={selectedDevice} />
    </div>
  );
};

export default DashboardHome;