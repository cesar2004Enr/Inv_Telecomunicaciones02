import styles from "../styles/escaneo.module.css";

const COLUMNS = [
  { key: "ip", label: "Dirección IP" },
  { key: "activo", label: "Estado" },
  { key: "hostname", label: "Hostname" },
  { key: "mac", label: "MAC" },
  { key: "fabricante", label: "Fabricante" },
  { key: "tipoDetectado", label: "Tipo Detectado" },
  { key: "puertosAbiertos", label: "Puertos" },
];

const ScanTable = ({ data, selected, onSelectAll, onSelectOne }) => {
  const activos = data.filter((d) => d.activo);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th style={{ width: "40px", textAlign: "center" }}>
              <input
                type="checkbox"
                checked={
                  selected.length === activos.length && activos.length > 0
                }
                onChange={onSelectAll}
                className={styles.checkbox}
              />
            </th>
            {COLUMNS.map((c) => (
              <th key={c.key}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.ip}
              className={selected.includes(item.ip) ? styles.selectedRow : ""}
            >
              <td style={{ textAlign: "center" }}>
                {item.activo && (
                  <input
                    type="checkbox"
                    checked={selected.includes(item.ip)}
                    onChange={() => onSelectOne(item.ip)}
                    className={styles.checkbox}
                  />
                )}
              </td>
              <td className={styles.ipCell}>{item.ip}</td>
              <td>
                <span
                  className={`${styles.statusBadge} ${item.activo ? styles.statusActive : styles.statusInactive}`}
                >
                  {item.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>{item.hostname || "-"}</td>
              <td className={styles.macCell}>{item.mac || "-"}</td>
              <td>{item.fabricante || "-"}</td>
              <td>
                <span className={styles.typeBadge}>
                  {item.tipoDetectado || "Desconocido"}
                </span>
              </td>
              <td>
                {item.puertosAbiertos?.map((p) => p.puerto).join(", ") || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScanTable;
