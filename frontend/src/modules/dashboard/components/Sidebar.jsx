import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NAV_ITEMS } from "../constants";
import styles from "../styles/dashboard.module.css";
import logo from "../../../assets/logo.png";

const EQUIPMENT_CATEGORIES = [
  { icon: "router", label: "Routers", path: "/dashboard/routers" },
  { icon: "hub", label: "Switches", path: "/dashboard/switches" },
  { icon: "call", label: "Teléfonos", path: "/dashboard/telefonos" },
  { icon: "print", label: "Impresoras", path: "/dashboard/impresoras" },
  { icon: "computer", label: "Computadoras", path: "/dashboard/computadoras" },
  { icon: "security", label: "Firewalls", path: "/dashboard/firewalls" }, 
];

const Sidebar = ({ 
  onAddDevice, 
  onRefreshStatus, 
  refreshing, 
  lastUpdate 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Estados locales
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true); 

  const handleNavigation = (path) => {
    if (path) navigate(path);
  };

  const isActive = (path) => {
    if (!path) return false;
    if (path === "/dashboard") return location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  const isEquipmentActive = EQUIPMENT_CATEGORIES.some((cat) =>
    location.pathname.startsWith(cat.path)
  );

  return (
    <aside
      className={styles.barraLateral}
      style={{ width: isExpanded ? "200px" : "70px" }} 
    >
      <div className={styles.sidebarBrand}>
        <img 
          src={logo} 
          alt="SIGI-TEL Logo" 
          className={isExpanded ? styles.logoExpanded : styles.logoCollapsed} 
        />
        {isExpanded && (
          <span className={styles.brandName}>SIGI-TEL</span>
        )}
      </div>
      <div className={styles.addButtonWrapper}>
        <button 
          className={styles.addDeviceButtonSidebar} 
          onClick={onAddDevice}
          title={!isExpanded ? "Agregar Dispositivo" : ""}
        >
          <span className="material-symbols-outlined">add</span>
          {isExpanded && <span>Agregar</span>}
        </button>
      </div>

      <div className={styles.navIcons}>
        {NAV_ITEMS.map((item) => {
          if (item.label === "Equipos") {
            return (
              <div key={item.label} className={styles.dropdownContainer}>
                <button
                  className={`${styles.botonNav} ${isEquipmentActive ? styles.botonNavActive : ""}`}
                  onClick={() => setEquipmentOpen(!equipmentOpen)}
                  title={!isExpanded ? item.label : ""}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  {isExpanded && (
                    <>
                      <span className={styles.textoNav}>{item.label}</span>
                      <span
                        className="material-symbols-outlined"
                        style={{
                          fontSize: "18px",
                          marginLeft: "auto",
                          transform: equipmentOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        expand_more
                      </span>
                    </>
                  )}
                </button>

                {isExpanded && equipmentOpen && (
                  <div className={styles.dropdownMenu}>
                    {EQUIPMENT_CATEGORIES.map((equipment) => (
                      <button
                        key={equipment.label}
                        className={`${styles.dropdownItem} ${location.pathname === equipment.path ? styles.dropdownItemActive : ""}`}
                        onClick={() => handleNavigation(equipment.path)}
                      >
                        <span className="material-symbols-outlined">{equipment.icon}</span>
                        <span className={styles.textoNav}>{equipment.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.label}
              className={`${styles.botonNav} ${isActive(item.path) ? styles.botonNavActive : ""}`}
              onClick={() => handleNavigation(item.path)}
              title={!isExpanded ? item.label : ""}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {isExpanded && <span className={styles.textoNav}>{item.label}</span>}
            </button>
          );
        })}
      </div>

      <div className={styles.sidebarFooter}>
        <button 
          className={styles.toggleSidebarBtn} 
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? "Colapsar menú" : "Expandir menú"}
        >
          <span className="material-symbols-outlined">
            {isExpanded ? "chevron_left" : "chevron_right"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;