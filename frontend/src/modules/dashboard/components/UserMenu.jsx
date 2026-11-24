import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/useAuth";
import styles from "../styles/dashboard.module.css";

const UserMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/");
  };

  const nombreCompleto = user?.nombreCompleto || "";
  const email = user?.email || "";

  return (
    <div className={styles.menuUsuario}>
      <div className={styles.avatarUsuario}>
        <span className="material-symbols-outlined">account_circle</span>
      </div>
      <div className={styles.usuarioInformacion}>
        <p className={styles.usuarioNombre}>{nombreCompleto || "Usuario"}</p>
        <p className={styles.usuarioEmail}>{email || ""}</p>
      </div>
      <div className={styles.divisionMenu} />
      <div className={styles.opcionesMenu}>
        <button className={styles.botonMenu} onClick={onClose}>
          <span className="material-symbols-outlined">settings</span>
          <span>Configuración</span>
        </button>
        <button
          className={`${styles.botonMenu} ${styles.botonCerrar}`}
          onClick={handleLogout}
        >
          <span className="material-symbols-outlined">logout</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default UserMenu;
