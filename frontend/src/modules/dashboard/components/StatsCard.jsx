import { STATS } from "../constants";
import styles from "../styles/dashboard.module.css";

const StatsCard = () => {
  return (
    <div className={styles.tarjetaColum}>
      {STATS.map((stat, i) => (
        <div key={i} className={styles.tarjetaStat}>
          <div className={styles.tarjetaEncabezado}>{stat.label}</div>
          <div className={styles.tarjetaNumero}>{stat.val}</div>
          <span className={`material-symbols-outlined ${styles.infoIcon}`}>
            info
          </span>
        </div>
      ))}
    </div>
  );
};

export default StatsCard;
