import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../shared/services/api";
import styles from "../styles/archivos.module.css";

const ArchivosPage = () => {
  const navigate = useNavigate();
  const [archivos, setArchivos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArchivos = async () => {
      try {
        const response = await api.getArchivos();
        setArchivos(response.data || []);
      } catch (err) {
        console.error("Error al cargar archivos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArchivos();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className={styles.contenedorPagina}>
      <div className={styles.accionesPagina} style={{ marginTop: '20px' }}>
        <button className={styles.botonNuevaLista} onClick={() => navigate("/dashboard/archivos/nueva")}>
          <span className="material-symbols-outlined">add</span>
          Nuevo Archivo
        </button>
      </div>

      {loading ? (
        <p style={{ padding: "20px" }}>Cargando archivos...</p>
      ) : archivos.length === 0 ? (
        <div className={styles.contenidoVacio}>
          <span className="material-symbols-outlined" style={{ fontSize: "80px", color: "#ccc" }}>description</span>
          <p className={styles.textoVacio}>Aún no hay archivos creados</p>
        </div>
      ) : (
        <div className={styles.cardsGrid}>
          {archivos.map((archivo) => (
            <div 
              key={archivo.id} 
              className={styles.fileCard}
              onClick={() => navigate(`/dashboard/archivos/editar/${archivo.id}`)}
            >
              <div className={styles.cardIcon}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#4caf50" }}>
                  table_chart
                </span>
              </div>
              <h3 className={styles.cardTitle} title={archivo.nombre}>{archivo.nombre}</h3>
              
              <div className={styles.cardDetails}>
                <p><strong>Peso:</strong> {formatSize(archivo.tamano)}</p>
                <p><strong>Autor:</strong> Tú</p>
                <p><strong>Modificado:</strong> {formatDate(archivo.updatedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivosPage;