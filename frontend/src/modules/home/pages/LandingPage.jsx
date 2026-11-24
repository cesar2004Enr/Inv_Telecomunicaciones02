import { useNavigate } from "react-router-dom";
import logo from "../../../assets/logo.png";
import styles from "../styles/landing.module.css";

const LandingPage = () => {
  const navigate = useNavigate();

    return (
        <div className={styles.landingContainer}>
        {/* Barra de Navegación Superior */}
        <nav className={styles.navbar}>
            <div className={styles.navBrand}>
            <img src={logo} alt="SIGI-TEL Logo" className={styles.navLogo} />
            <span className={styles.navTitle}>SIGI-TEL</span>
            </div>
            <div className={styles.navActions}>
            <button className={styles.botones} onClick={() => navigate("/login")}>
                Iniciar Sesión
            </button>
            <button className={styles.botones} onClick={() => navigate("/registro-1")}>
                Registrarme
            </button>
            </div>
        </nav>

        <main className={styles.heroSection}>
            <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
                Sistema web de Gestión E Inventario para el Control Integral del Equipamiento de Telecomunicaciones en la Fiscalia General del Estado de Tabasco
            </h1>
            <p className={styles.heroSubtitle}>
                La plataforma centralizada para la Fiscalía General del Estado. Administra, monitorea y audita toda tu infraestructura de red en tiempo real de forma segura y automatizada.
            </p>
            <div className={styles.heroButtons}>
                <button className={styles.btnPrimaryLarge} onClick={() => navigate("/login")}>
                Comenzar ahora
                </button>
            </div>
            </div>
        </main>

        <section className={styles.featuresSection}>
            <h2 className={styles.featuresTitle}>¿Qué puedes hacer con SIGI-TEL?</h2>
            <div className={styles.featuresGrid}>
            
            <div className={styles.featureCard}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#1976d2" }}>
                lan
                </span>
                <h3>Escaneo Automático</h3>
                <p>Descubre y clasifica dispositivos (Routers, Switches, PCs) en tu red automáticamente usando Nmap y SNMP.</p>
            </div>

            <div className={styles.featureCard}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#4caf50" }}>
                monitoring
                </span>
                <h3>Monitoreo en Vivo</h3>
                <p>Verifica el estado de disponibilidad de tus equipos mediante pings constantes para saber si están activos.</p>
            </div>

            <div className={styles.featureCard}>
                <span className="material-symbols-outlined" style={{ fontSize: "48px", color: "#d32f2f" }}>
                security
                </span>
                <h3>Gestión Segura</h3>
                <p>Protege las credenciales de tu red y controla quién tiene acceso a la información del inventario.</p>
            </div>

            </div>
        </section>

        {/* NUEVA SECCIÓN: TECNOLOGÍAS UTILIZADAS */}
        <section className={styles.techSection}>
            <h2 className={styles.featuresTitle}>Tecnologías Utilizadas</h2>
            <p style={{ color: "#666", marginBottom: "40px", fontSize: "18px" }}>
            Desarrollado con un stack moderno y robusto para garantizar el mejor rendimiento.
            </p>
            
            <div className={styles.techGrid}>
            <div className={styles.techItem}>
                <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#61dafb" }}>code</span>
                <h4>React + Vite</h4>
                <p>Interfaz de usuario rápida y reactiva.</p>
            </div>
            
            <div className={styles.techItem}>
                <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#68a063" }}>dns</span>
                <h4>Node.js + Express</h4>
                <p>Backend asíncrono y eficiente para las APIs REST.</p>
            </div>

            <div className={styles.techItem}>
                <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#336791" }}>storage</span>
                <h4>PostgreSQL + Prisma</h4>
                <p>Base de datos relacional segura con ORM tipado.</p>
            </div>

            <div className={styles.techItem}>
                <span className="material-symbols-outlined" style={{ fontSize: "40px", color: "#f7931e" }}>radar</span>
                <h4>Nmap & SNMP</h4>
                <p>Protocolos y herramientas para el descubrimiento de red.</p>
            </div>
            </div>
        </section>

        {/* NUEVA SECCIÓN: SEGURIDAD */}
        <section className={styles.securitySection}>
            <h2 className={styles.featuresTitle}>Seguridad de Nivel Empresarial</h2>
            <div className={styles.securityContent}>
            <div className={styles.securityList}>
                <div className={styles.securityListItem}>
                <span className="material-symbols-outlined" style={{ color: "#4caf50" }}>check_circle</span>
                <div>
                    <h4>Encriptación de Contraseñas (Bcrypt)</h4>
                    <p>Las credenciales nunca se guardan en texto plano. Utilizamos hashing criptográfico seguro.</p>
                </div>
                </div>
                <div className={styles.securityListItem}>
                <span className="material-symbols-outlined" style={{ color: "#4caf50" }}>check_circle</span>
                <div>
                    <h4>Autenticación por Tokens (JWT)</h4>
                    <p>Sesiones seguras y sin estado para proteger cada petición a la API.</p>
                </div>
                </div>
                <div className={styles.securityListItem}>
                <span className="material-symbols-outlined" style={{ color: "#4caf50" }}>check_circle</span>
                <div>
                    <h4>Verificación de Doble Factor (Correo)</h4>
                    <p>Los nuevos usuarios deben verificar su identidad mediante un código OTP enviado a su correo.</p>
                </div>
                </div>
                <div className={styles.securityListItem}>
                <span className="material-symbols-outlined" style={{ color: "#4caf50" }}>check_circle</span>
                <div>
                    <h4>Prevención de Inyecciones SQL</h4>
                    <p>Gracias al uso de Prisma ORM, las consultas a la base de datos están parametrizadas y blindadas.</p>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* Pie de página */}
        <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} SIGI-TEL - Fiscalía General del Estado. Todos los derechos reservados.</p>
        </footer>
        </div>
    );
};

export default LandingPage;