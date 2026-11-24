import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../shared/context/useAuth";
import styles from "../styles/login.module.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.email || !credentials.password) {
      setError("Por favor, complete todos los campos.");
      return;
    }

    try {
      setLoading(true);
      await login(credentials);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.formulario}>
      {error && (
        <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "14px" }}>
          {error}
        </div>
      )}

      <div className={styles.entradaDatos}>
        <label>Correo Electrónico:</label>
        <input
          type="email"
          name="email"
          className={styles.cuadroEntrada}
          value={credentials.email}
          onChange={handleChange}
        />
      </div>

      <div className={styles.entradaDatos}>
        <label>Contraseña:</label>
        <input
          type={mostrarContraseña ? "text" : "password"}
          name="password"
          className={styles.cuadroEntrada}
          value={credentials.password}
          onChange={handleChange}
        />
      </div>

      <div
        className={styles.mostrarContraseña}
        onClick={() => setMostrarContraseña(!mostrarContraseña)}
      >
        <input
          type="checkbox"
          checked={mostrarContraseña}
          readOnly
          className={styles.checkbox}
        />
        <label className={styles.mostrarContraseñaEtiqueta}>
          <span className="material-symbols-outlined">
            {mostrarContraseña ? "visibility_off" : "visibility"}
          </span>
          Mostrar contraseña
        </label>
      </div>

      <button type="submit" className={styles.botones} disabled={loading}>
        {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
      </button>

      <div className={styles.lineaSeparadora}></div>

      <div className={styles.seccionRegistrar}>
        <p className={styles.textoAyuda}>¿Aún no tienes cuenta?</p>
        <button
          type="button"
          onClick={() => navigate("/registro-1")}
          className={`${styles.botones} ${styles.botonRegistro}`}
        >
          Registrarme
        </button>
      </div>

      {/* BOTÓN CANCELAR AGREGADO AQUÍ */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          type="button"
          onClick={() => navigate("/")}
          className={`${styles.botones} ${styles.botonCancelar}`}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default LoginForm;