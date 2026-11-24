import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // <-- Importamos useLocation
import { useAuth } from "../../../shared/context/useAuth";
import SearchBar from "./SearchBar";
import styles from "../styles/dashboard.module.css";

const Header = ({ searchTerm, onSearchChange }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Verificamos si estamos en la ruta de archivos
  const isArchivosPage = location.pathname.includes("/dashboard/archivos");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={styles.barraSuperior}>
      <div className={styles.topBarRight}>
        
        {/* OCULTAR BUSCADOR EN ARCHIVOS */}
        {!isArchivosPage && (
          <div className={styles.searchWrapper}>
            <SearchBar isVisible={true} searchTerm={searchTerm} onSearchChange={onSearchChange} />
          </div>
        )}

        {/* Menú de Configuración (Engranaje) - Se queda intacto */}
        <div className={styles.settingsWrapper}>
          <span
            className={`material-symbols-outlined ${styles.settingsIcon}`}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            settings
          </span>

          {isSettingsOpen && (
            <div className={styles.menuSettings}>
              <div className={styles.opcionesMenu}>
                <button className={styles.botonMenu} onClick={() => setIsSettingsOpen(false)}>
                  <span className="material-symbols-outlined">account_circle</span>
                  <span>Cuenta</span>
                </button>
                <button className={styles.botonMenu} onClick={() => setIsSettingsOpen(false)}>
                  <span className="material-symbols-outlined">settings</span>
                  <span>Configuración</span>
                </button>
                <div className={styles.divisionMenu} />
                <button className={`${styles.botonMenu} ${styles.botonCerrar}`} onClick={handleLogout}>
                  <span className="material-symbols-outlined">logout</span>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;