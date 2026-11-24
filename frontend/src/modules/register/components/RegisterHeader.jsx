import logo from "../../../assets/logo.png";
import styles from "../styles/register.module.css";

const RegisterHeader = () => {
    return (
            <header className={styles.barraSuperior}>
                <div className={styles.headerContent}>
                    <img src={logo} alt="SIGI-TEL Logo" className={styles.headerLogo} />
                <span className={styles.headerTitle}>SIGI-TEL</span>
            </div>
        </header>
    );
};

export default RegisterHeader;