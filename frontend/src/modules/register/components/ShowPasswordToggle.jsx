import styles from "../styles/register.module.css";

const ShowPasswordToggle = ({ showPassword, onToggle }) => {
  return (
    <div className={styles.mostrarContraseñaEtiqueta} onClick={onToggle}>
      <input
        type="checkbox"
        checked={showPassword}
        readOnly
        className={styles.checkbox}
      />
      <label className={styles.mostrarContraseñaEtiqueta}>
        <span className="material-symbols-outlined">
          {showPassword ? "visibility_off" : "visibility"}
        </span>
        Mostrar contraseña
      </label>
    </div>
  );
};

export default ShowPasswordToggle;
