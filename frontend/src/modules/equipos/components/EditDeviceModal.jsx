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
];

const EditDeviceModal = ({ isOpen, onClose, onDeviceUpdated, device }) => {
  const [formData, setFormData] = useState(() => ({
    tipo: device?.tipoDispositivo?.nombre || "",
    nombreEquipo: device?.nombreEquipo || "",
    nombreInventario: device?.nombreInventario || "",
    modelo: device?.modelo || "",
    numeroSerie: device?.numeroSerie || "",
    direccionIpv4: device?.interfaces?.[0]?.direccionIpv4 || device?.ipv4 || "",
    mascaraSubred: device?.interfaces?.[0]?.mascaraSubred || "",
    direccionMac: device?.interfaces?.[0]?.direccionMac || "",
    marca: device?.marca?.nombre || "",
    sitio: device?.sitio || "",
  }));

  const [fiscalias, setFiscalias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiscalias = async () => {
      try {
        const response = await api.getFiscalias();
        setFiscalias(response.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    if (isOpen) fetchFiscalias();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tipo || !formData.nombreEquipo) {
      setError("Complete los campos obligatorios.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.updateEquipment(device.id, formData);
      onDeviceUpdated();
    } catch (err) {
      setError(err.message || "Error al actualizar dispositivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Editar Dispositivo</h2>
        {error && <div className={styles.modalError}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Tipo de Dispositivo:</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className={styles.formInput}
            >
              <option value="">Seleccione un tipo</option>
              {DEVICE_TYPES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Nombre del equipo:</label>
            <input
              type="text"
              name="nombreEquipo"
              value={formData.nombreEquipo}
              onChange={handleChange}
              className={styles.formInput}
              maxLength={50}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Modelo:</label>
            <input
              type="text"
              name="modelo"
              value={formData.modelo}
              onChange={handleChange}
              className={styles.formInput}
              maxLength={50}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Número de serie:</label>
            <input
              type="text"
              name="numeroSerie"
              value={formData.numeroSerie}
              onChange={handleChange}
              className={styles.formInput}
              maxLength={50}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Dirección IPv4:</label>
            <OctetInput
              value={formData.direccionIpv4}
              onChange={handleChange}
              label="IPv4"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Máscara de subred:</label>
            <OctetInput
              value={formData.mascaraSubred}
              onChange={handleChange}
              label="Mascara"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Dirección MAC:</label>
            <input
              type="text"
              name="direccionMac"
              value={formData.direccionMac}
              onChange={handleChange}
              className={styles.formInput}
              maxLength={17}
              placeholder="00:00:00:00:00:00"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Marca:</label>
            <input
              type="text"
              name="marca"
              value={formData.marca}
              onChange={handleChange}
              className={styles.formInput}
              maxLength={50}
            />
          </div>

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
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.addButton}
              disabled={loading}
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDeviceModal;
