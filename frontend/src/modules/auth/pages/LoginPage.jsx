import LoginForm from "../components/LoginForm";
import logo from "../../../assets/logo.png"; 
import styles from "../styles/login.module.css";

const LoginPage = () => {
  return (
    <div className={styles.fondo}>
      <div className={styles.contenedorInicioSesion}>
        <div className={styles.carta}>
          <header className={styles.loginHeader}>
            <div className={styles.brandContainer}>
              <img src={logo} alt="SIGI-TEL Logo" className={styles.logoImage} />
              <h1 className={styles.brandName}>SIGI-TEL</h1>
            </div>
            <h2 className={styles.subtitulo}>
              Inicie sesión con sus credenciales
            </h2>
          </header>

          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;