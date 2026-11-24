import styles from "../styles/equipos.module.css";

const ActionBar = ({ selectedCount, onDelete, onArchive, onEdit, loading }) => {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.actionBar}>
      <span className={styles.actionBarInfo}>
        {selectedCount} elemento{selectedCount !== 1 ? "s" : ""} seleccionado
        {selectedCount !== 1 ? "s" : ""}
      </span>
      <div className={styles.actionBarButtons}>
        <button className={styles.editButton} onClick={onEdit} title="Editar">
          <span className="material-symbols-outlined">edit</span>
          Editar
        </button>
        <button
          className={styles.archiveButton}
          onClick={onArchive}
          title="Archivar"
        >
          <span className="material-symbols-outlined">archive</span>
          Archivar
        </button>
        <button
          className={styles.deleteButton}
          onClick={onDelete}
          disabled={loading}
          title="Eliminar"
        >
          <span className="material-symbols-outlined">delete</span>
          {loading ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
