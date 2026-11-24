import styles from "../styles/equipos.module.css";

const EquipmentTable = ({
  data,
  columns,
  selectedIds,
  onSelectAll,
  onSelectOne,
  onInfoClick,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={styles.emptyTable}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "60px", color: "#ccc" }}
        >
          inventory_2
        </span>
        <p>No hay dispositivos registrados</p>
      </div>
    );
  }

  const allSelected = data.length > 0 && selectedIds.length === data.length;
  const someSelected =
    selectedIds.length > 0 && selectedIds.length < data.length;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const getCellValue = (item, col) => {
    switch (col.key) {
      case "interfaces":
        return item.ipv4 || item.interfaces?.[0]?.direccionIpv4 || "-";
      case "marca":
        return item.marca?.nombre || item.marca || "-";
      case "tipoDispositivo":
        return item.tipoDispositivo?.nombre || item.tipo || "-";
      case "actividad":
      case "estado":
        return item.actividad || item.estado || "Activo";
      case "fechaRegistro":
      case "fechaAgregado":
        return formatDate(item[col.key]);
      default:
        return item[col.key] || "-";
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "40px", textAlign: "center" }}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onChange={onSelectAll}
                className={styles.checkbox}
              />
            </th>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              className={
                selectedIds.includes(item.id) ? styles.selectedRow : ""
              }
            >
              <td style={{ textAlign: "center" }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => onSelectOne(item.id)}
                  className={styles.checkbox}
                />
              </td>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.key === "actividad" || col.key === "estado" ? (
                    <span
                      className={`${styles.statusBadge} ${getCellValue(item, col) === "Activo" ? styles.statusActive : styles.statusInactive}`}
                    >
                      {getCellValue(item, col)}
                    </span>
                  ) : col.key === "info" ? (
                    <span
                      className="material-symbols-outlined"
                      style={{
                        cursor: "pointer",
                        color: "#666",
                        fontSize: "20px",
                      }}
                      onClick={() => onInfoClick && onInfoClick(item)}
                    >
                      info
                    </span>
                  ) : (
                    getCellValue(item, col)
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
