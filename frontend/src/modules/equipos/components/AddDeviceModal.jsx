import { useState, useEffect } from "react";
import api from "../../../shared/services/api";
import OctetInput from "./OctetInput";
import styles from "../styles/equipos.module.css";

const DEVICE_TYPES = [
  { value: "Router", label: "Router" },
  { value: "Switch", label: "Switch" },
  { value: "Teléfono", label: "Teléfono" },
  { value: "Impresora", label: "Impresora" },
  { value: "Computadora", label: "Computadora" },
  { value: "Firewall", label: "Firewall" }, 
];

const AddDeviceModal = ({ isOpen, onClose, onDeviceAdded }) => {
  const [formData, setFormData] = useState({
    tipo: "",
    nombreEquipo: "",
    nombreInventario: "",
    modelo: "",
    numeroSerie: "",
    direccionIpv4: "",
    mascaraSubred: "",
    direccionMac: "",
    marca: "",
    sitio: "", // Aquí guardaremos el nombre de la fiscalía
  });
  const [fiscalias, setFiscalias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState(null);

  // Cargar las fiscalías al abrir el modal
  useEffect(() => {
    const fetchFiscalias = async () => {
      try {
        const response = await api.getFiscalias();
        setFiscalias(response.data || []);
      } catch (err) {
        console.error("Error al cargar fiscalías", err);
      }
    };
    if (isOpen) {
      fetchFiscalias();
    }
  }, [isOpen]);

  if (!isOpen && !notification) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.direccionIpv4) {
      setError("Complete la dirección IPv4.");
      return;
    }

    onClose();
    setLoading(true);
    setError("");

    setNotification({
      type: "info",
      message: `🔍 Escaneando ${formData.direccionIpv4} en segundo plano...`,
    });

    try {
      await api.addEquipment(formData);
      
      setFormData({
        tipo: "",
        nombreEquipo: "",
        nombreInventario: "",
        modelo: "",
        numeroSerie: "",
        direccionIpv4: "",
        mascaraSubred: "",
        direccionMac: "",
        marca: "",
        sitio: "",
      });

      setNotification({
        type: "success",
        message: `✅ Dispositivo agregado exitosamente`,
      });

      onDeviceAdded();
    } catch (err) {
      setNotification({
        type: "error",
        message: `❌ ${err.message || "Error al agregar dispositivo"}`,
      });
    } finally {
      setLoading(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <>
      {notification && (
        <div
          className={`${styles.toast} ${
            notification.type === "success"
              ? styles.toastSuccess
              : notification.type === "error"
              ? styles.toastError
              : styles.toastInfo
          }`}
        >
          <span className={styles.toastIcon}>
            {notification.type === "success" ? "✅" : notification.type === "error" ? "❌" : "🔍"}
          </span>
          <span className={styles.toastMessage}>{notification.message}</span>
          <button className={styles.toastClose} onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {isOpen && (
        <div className={styles.modalOverlay} onClick={onClose}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Agregar Dispositivo</h2>
            {error && <div className={styles.modalError}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Tipo de Dispositivo:</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} className={styles.formInput}>
                  <option value="">Auto-detectar</option>
                  {DEVICE_TYPES.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Dirección IPv4:</label>
                <OctetInput value={formData.direccionIpv4} onChange={handleChange} label="IPv4" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Máscara de subred:</label>
                <OctetInput value={formData.mascaraSubred} onChange={handleChange} label="Mascara" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre del equipo (opcional):</label>
                <input type="text" name="nombreEquipo" value={formData.nombreEquipo} onChange={handleChange} className={styles.formInput} maxLength={50} placeholder="Se detectará automáticamente" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nombre de inventario (opcional):</label>
                <input type="text" name="nombreInventario" value={formData.nombreInventario} onChange={handleChange} className={styles.formInput} maxLength={100} placeholder="Ej: INV-RTR-001" />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Marca (opcional):</label>
                <input type="text" name="marca" value={formData.marca} onChange={handleChange} className={styles.formInput} maxLength={50} placeholder="Se detectará automáticamente" />
              </div>

              {/* AQUÍ ESTÁ EL CAMBIO DE UBICACIÓN A FISCALÍA */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Ubicación (Fiscalía):</label>
                <select name="sitio" value={formData.sitio} onChange={handleChange} className={styles.formInput}>
                  <option value="">Seleccione una fiscalía (Opcional)</option>
                  {fiscalias.map((f) => (
                    <option key={f.id} value={f.nombreEmpresa}>
                      {f.nombreEmpresa} ({f.ciudad})
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.modalButtons}>
                <button type="button" className={styles.cancelButton} onClick={onClose}>Cancelar</button>
                <button type="submit" className={styles.addButton} disabled={loading}>
                  {loading ? "Escaneando..." : "Agregar y Escanear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddDeviceModal;