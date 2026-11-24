import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../context/useRegister";
import { validateStep4 } from "../validations/authValidation";
import { APP_TITLE } from "../constants/registerConstants";
import api from "../../../shared/services/api";
import StepIndicator from "../components/StepIndicator";
import styles from "../styles/register.module.css";
import RegisterHeader from "../components/RegisterHeader";

const STEPS = ["Cuenta", "Información", "Fiscalía", "Verificación"];

const RegisterStep4Page = () => {
  const navigate = useNavigate();
  const { registerData } = useRegister();
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  // Al cargar la página, enviamos el código automáticamente por correo
  useEffect(() => {
    const sendCode = async () => {
      if (!registerData.userId) return;
      try {
        setLoading(true);
        // Llamamos al backend sin especificar método (solo enviará correo)
        const response = await api.resendCode(registerData.userId);
        if (response.data && response.data.code) {
          setGeneratedCode(response.data.code);
        }
      } catch {
        setError("Error al enviar el código al correo. Intente de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    sendCode();
  }, [registerData.userId]);

  const handleConfirm = async () => {
    const { isValid, message } = validateStep4(code);
    if (!isValid) {
      setError(message);
      return;
    }

    if (!registerData.userId) {
      setError("Error: no se encontró el usuario. Regrese al paso 1.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await api.registerStep4(registerData.userId, code);
      alert("¡Registro completado exitosamente!");
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al verificar el código");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!registerData.userId) return;
    try {
      setError("");
      setLoading(true);
      const response = await api.resendCode(registerData.userId);
      if (response.data && response.data.code) {
        setGeneratedCode(response.data.code);
        alert("Nuevo código enviado a tu correo electrónico.");
        setCode("");
      }
    } catch (err) {
      setError(err.message || "Error al reenviar el código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.fondo}>
      <RegisterHeader />

      <div className={styles.contenedorDatos}>
        <div className={styles.formularioGeneral}>
          <StepIndicator steps={STEPS} currentStep={4} />

          <div className={styles.cuerpoFormulario}>

            {error && (
              <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", marginBottom: "15px" }}>
                {error}
              </div>
            )}

            <div style={{ backgroundColor: "#e3f2fd", padding: "15px", borderRadius: "8px", marginBottom: "20px", textAlign: "center", color: "#1565c0" }}>
              <span className="material-symbols-outlined" style={{ verticalAlign: "middle", marginRight: "8px" }}>mail</span>
              Hemos enviado un código de 6 dígitos a tu correo electrónico.
            </div>

            <p className={styles.subtitulo}>
              Ingrese el código de 6 dígitos:
            </p>

            <input
              type="text"
              className={styles.cuadroEntrada}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              maxLength="6"
            />

            {/* Solo para pruebas, puedes quitar este recuadro luego */}
            {generatedCode && (
              <p style={{ fontSize: "12px", color: "#888", textAlign: "center", marginTop: "5px" }}>
                (Para pruebas, el código es: {generatedCode})
              </p>
            )}

            <div className={styles.botones}>
              <button
                className={styles.btnContinuar}
                onClick={() => navigate("/registro-3")}
              >
                Regresar
              </button>
              <button 
                className={styles.btnReenviar} 
                onClick={handleResend}
                disabled={loading}
              >
                Reenviar
              </button>
              <button
                className={styles.btnContinuar}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? "Verificando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep4Page;