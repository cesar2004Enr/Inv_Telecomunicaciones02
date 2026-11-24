import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../../../shared/services/api";
import EquipmentTable from "../components/EquipmentTable";
import ActionBar from "../components/ActionBar";
import EditDeviceModal from "../components/EditDeviceModal";
import DeviceDetailModal from "../components/DeviceDetailModal";
import styles from "../styles/equipos.module.css";

const COLUMNS = [
  { key: "nombreEquipo", label: "Nombre" },
  { key: "modelo", label: "Modelo" },
  { key: "numeroSerie", label: "Serie" },
  { key: "interfaces", label: "IPv4" },
  { key: "marca", label: "Marca" },
  { key: "actividad", label: "Estado" },
  { key: "fechaRegistro", label: "Fecha" },
  { key: "info", label: "" },
];

const TelefonosPage = () => {
  const outletContext = useOutletContext();
  const refreshKey = outletContext?.refreshKey || 0;
  const searchTerm = outletContext?.searchTerm || "";
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleting, setDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const loadDevices = async () => {
      try {
        setLoading(true);
        const response = await api.getEquipmentByType("Teléfono", searchTerm);
        if (!cancelled)
          setDevices(
            (response.data || []).map((d) => ({
              ...d,
              ipv4: d.interfaces?.[0]?.direccionIpv4 || "-",
            })),
          );
      } catch (err) {
        if (!cancelled) console.error("Error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadDevices();
    return () => {
      cancelled = true;
    };
  }, [searchTerm, refreshKey]);

  const reloadDevices = async () => {
    const response = await api.getEquipmentByType("Teléfono", searchTerm);
    setDevices(
      (response.data || []).map((d) => ({
        ...d,
        ipv4: d.interfaces?.[0]?.direccionIpv4 || "-",
      })),
    );
  };

  const handleSelectAll = () =>
    setSelectedIds(
      selectedIds.length === devices.length ? [] : devices.map((d) => d.id),
    );
  const handleSelectOne = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`¿Eliminar ${selectedIds.length}?`)) return;
    try {
      setDeleting(true);
      await api.deleteEquipment("Teléfono", selectedIds);
      setSelectedIds([]);
      reloadDevices();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };
  const handleEdit = () => {
    if (selectedIds.length !== 1) {
      alert("Seleccione un solo dispositivo");
      return;
    }
    const device = devices.find((d) => d.id === selectedIds[0]);
    if (device) {
      setEditingDevice(device);
      setIsEditModalOpen(true);
    }
  };
  const handleDeviceUpdated = () => {
    setIsEditModalOpen(false);
    setEditingDevice(null);
    setSelectedIds([]);
    reloadDevices();
  };
  const handleInfoClick = (device) => {
    setSelectedDevice(device);
    setIsDetailModalOpen(true);
  };

  if (loading) return <div className={styles.loading}>Cargando...</div>;

  return (
    <div className={styles.contenedorPagina}>

      <ActionBar
        selectedCount={selectedIds.length}
        onDelete={handleDelete}
        onArchive={() => {}}
        onEdit={handleEdit}
        loading={deleting}
      />
      <EquipmentTable
        data={devices}
        columns={COLUMNS}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onSelectOne={handleSelectOne}
        onInfoClick={handleInfoClick}
      />
      <EditDeviceModal
        key={editingDevice?.id || "new"}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onDeviceUpdated={handleDeviceUpdated}
        device={editingDevice}
      />
      <DeviceDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        device={selectedDevice}
      />
    </div>
  );
};

export default TelefonosPage;
