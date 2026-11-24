import { TABLE_HEADERS } from "../constants";
import styles from "../styles/dashboard.module.css";

const EquipmentTable = ({ data }) => {
  return (
    <div className={styles.contenedorTabla}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            {TABLE_HEADERS.map((header, index) => (
              <th key={index}>
                {header}
                {header === "IPv4" && (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "14px" }}
                  >
                    undo
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.ipv4}</td>
              <td>{item.marca}</td>
              <td>{item.serie}</td>
              <td>{item.sitio}</td>
              <td>{item.funcionamiento}</td>
              <td>
                <span
                  className={`material-symbols-outlined ${styles.columnaInfo}`}
                >
                  info
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EquipmentTable;
