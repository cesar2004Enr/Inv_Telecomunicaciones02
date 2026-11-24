import styles from "../styles/login.module.css";

const PasswordField = ({ value, visible, onChange, onToggle }) => {
  return (
    <div className={styles.entradaDatos}>
      <label htmlFor="password">Contraseña:</label>

      <input
        type={visible ? "text" : "password"}
        id="password"
        value={value}
        onChange={onChange}
        className={styles.cuadroEntrada}
        autoComplete="current-password"
      />

      <div className={styles.mostrarContraseña}>
        <input
          type="checkbox"
          id="togglePass"
          checked={visible}
          onChange={onToggle}
          className={styles.checkbox}
        />

        <label
          htmlFor="togglePass"
          className={styles.mostrarContraseñaEtiqueta}
        >
          <span className="material-symbols-outlined">
            {visible ? "visibility" : "visibility_off"}
          </span>
          Mostrar contraseña
        </label>
      </div>
    </div>
  );
};

export default PasswordField;
