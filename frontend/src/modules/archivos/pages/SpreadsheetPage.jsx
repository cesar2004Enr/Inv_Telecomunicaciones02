import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../shared/services/api";
import styles from "../styles/archivos.module.css";

import { createUniver, LocaleType, merge } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import UniverPresetSheetsCoreEsES from "@univerjs/preset-sheets-core/locales/es-ES";
import "@univerjs/preset-sheets-core/lib/index.css";

const SpreadsheetPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const containerRef = useRef(null);
    const univerAPIRef = useRef(null);

    const [loading, setLoading] = useState(true);
    const [fileName, setFileName] = useState("");

    // Estados para el modal de guardado
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [tempFileName, setTempFileName] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const initUniver = async () => {
            if (!containerRef.current) return;
            containerRef.current.innerHTML = "";

            try {
                const { univerAPI } = createUniver({
                    locale: LocaleType.ES_ES,
                    locales: { [LocaleType.ES_ES]: merge({}, UniverPresetSheetsCoreEsES) },
                    presets: [UniverSheetsCorePreset({ container: containerRef.current })],
                });

                univerAPIRef.current = univerAPI;

                if (id) {
                    const response = await api.getArchivoById(id);
                    if (isMounted) {
                        setFileName(response.data.nombre);
                        setTempFileName(response.data.nombre);
                    }
                    univerAPI.createWorkbook(response.data.contenido || {});
                } else {
                    univerAPI.createWorkbook({});
                    if (isMounted) setTempFileName("Hoja sin título");
                }
            } catch (error) {
                console.error("Error al inicializar Univer:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const timer = setTimeout(() => initUniver(), 100);

        return () => {
            isMounted = false;
            clearTimeout(timer);
            if (univerAPIRef.current) univerAPIRef.current.dispose();
        };
    }, [id]);

    const handleSaveClick = () => {
        setShowSaveModal(true);
    };

    const confirmSave = async () => {
        if (!tempFileName.trim()) {
            alert("Por favor, ingresa un nombre para el archivo.");
            return;
        }
        if (!univerAPIRef.current) return;

        setSaving(true);
        try {
            const snapshot = univerAPIRef.current.getActiveWorkbook().save();
            const jsonString = JSON.stringify(snapshot);
            const tamanoBytes = new Blob([jsonString]).size;

            const payload = { nombre: tempFileName, contenido: snapshot, tamano: tamanoBytes };

            if (id) {
                await api.updateArchivo(id, payload);
            } else {
                await api.createArchivo(payload);
            }

            setShowSaveModal(false);
            navigate("/dashboard/archivos");
        } catch (error) {
            alert("Error al guardar: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    // Función para eliminar el archivo
    const handleDelete = async () => {
        // Verificamos que realmente sea un archivo existente (que tenga ID)
        if (!id) {
            alert("Este archivo no ha sido guardado aún. Si deseas salir sin guardar, presiona el botón 'Volver'.");
            return;
        }

        const confirmDelete = window.confirm(`¿Estás seguro de que deseas eliminar el archivo "${fileName}"? Esta acción no se puede deshacer.`);

        if (confirmDelete) {
            try {
                await api.deleteArchivo(id);
                alert("Archivo eliminado correctamente.");
                navigate("/dashboard/archivos");
            } catch (error) {
                alert("Error al eliminar el archivo: " + error.message);
            }
        }
    };

    return (
        <div className={styles.fullScreenEditor}>

            {showSaveModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3 className={styles.modalTitle}>Guardar Archivo</h3>
                        <label className={styles.formLabel}>Nombre del archivo:</label>
                        <input
                            type="text"
                            className={styles.formInput}
                            value={tempFileName}
                            onChange={(e) => setTempFileName(e.target.value)}
                            autoFocus
                            onKeyDown={(e) => e.key === "Enter" && confirmSave()}
                        />
                        <div className={styles.modalButtons}>
                            <button className={styles.cancelButton} onClick={() => setShowSaveModal(false)}>Cancelar</button>
                            <button className={styles.addButton} onClick={confirmSave} disabled={saving}>
                                {saving ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.editorHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button className={styles.iconBtn} onClick={() => navigate("/dashboard/archivos")} title="Salir">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button className={styles.saveBtn} onClick={handleSaveClick}>
                        <span className="material-symbols-outlined">save</span>
                        Guardar
                    </button>
                </div>

                <span className={styles.fileTitle}>{fileName || "Nuevo Archivo"}</span>

                {/* BOTÓN DE ELIMINAR EN LA ESQUINA DERECHA */}
                <button
                    className={styles.deleteBtn}
                    onClick={handleDelete}
                    title="Eliminar archivo"
                >
                    <span className="material-symbols-outlined">delete</span>
                </button>
            </div>

            {loading && (
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                    Cargando hoja de cálculo...
                </div>
            )}

            <div className={styles.univerContainer} style={{ opacity: loading ? 0 : 1 }}>
                <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
            </div>
        </div>
    );
};

export default SpreadsheetPage;