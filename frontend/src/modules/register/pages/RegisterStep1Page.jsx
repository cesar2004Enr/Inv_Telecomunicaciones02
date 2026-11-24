import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { validateStep1, validateEmail, validatePassword } from "../validations/authValidation";
import { INITIAL_STEP1_DATA, PASSWORD_RULES_TEXT } from "../constants/registerConstants";
import RegisterHeader from "../components/RegisterHeader";
import StepIndicator from "../components/StepIndicator";
import FormField from "../components/FormField";
import ShowPasswordToggle from "../components/ShowPasswordToggle";
import FormNavigation from "../components/FormNavigation";
import styles from "../styles/register.module.css";

const STEPS = ["Cuenta", "Información", "Fiscalía", "Verificación"];

const RegisterStep1Page = () => {
  const navigate = useNavigate();
  const { formData, handleChange, handleSubmit, loading, error } =
    useRegisterForm(INITIAL_STEP1_DATA, 1, "/registro-2");
  
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [localError, setLocalError] = useState(""); // Para errores del captcha
  
  const recaptchaRef = useRef(null);

  const handleEmailChange = (e) => {
    handleChange(e);
    const emailValidation = validateEmail(e.target.value);
    setFieldErrors((prev) => ({
      ...prev,
      email: emailValidation.isValid ? "" : emailValidation.message,
    }));
  };

  const handlePasswordChange = (e) => {
    handleChange(e);
    const passwordValidation = validatePassword(e.target.value);
    setFieldErrors((prev) => ({
      ...prev,
      password: passwordValidation.isValid ? "" : passwordValidation.message,
    }));
  };

  const handleConfirmChange = (e) => {
    handleChange(e);
    if (e.target.value !== formData.password) {
      setFieldErrors((prev) => ({
        ...prev,
        confirmar: "Las contraseñas no coinciden.",
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, confirmar: "" }));
    }
  };

  const handleContinue = async () => {
    setLocalError("");

    // 1. Validaciones locales
    const validation = validateStep1(formData);
    if (!validation.isValid) {
      setLocalError(validation.message);
      return;
    }

    // 2. Validar el CAPTCHA
    if (!recaptchaToken) {
      setLocalError("Por favor, marca la casilla 'No soy un robot'.");
      return;
    }

    // 3. Enviar al backend
    const success = await handleSubmit(recaptchaToken);
    
    // Si falla, reiniciamos el captcha para que el usuario vuelva a intentar
    if (!success && recaptchaRef.current) {
      recaptchaRef.current.reset();
      setRecaptchaToken(null);
    }
  };

  return (
    <div className={styles.fondo}>
      <RegisterHeader />

      <div className={styles.contenedorDatos}>
        <div className={styles.formularioGeneral}>
          <StepIndicator steps={STEPS} currentStep={1} />

          <div className={styles.cuerpoFormulario}>
            
            {/* Mostrar errores del formulario o del captcha */}
            {(error || localError) && (
              <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "14px", textAlign: "center" }}>
                {error || localError}
              </div>
            )}

            <FormField
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleEmailChange}
              placeholder="usuario@gmail.com"
              error={fieldErrors.email}
            />

            <FormField
              label="Contraseña"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handlePasswordChange}
              helpText={PASSWORD_RULES_TEXT}
              error={fieldErrors.password}
            />

            <FormField
              label="Confirmar"
              name="confirmar"
              type={showPassword ? "text" : "password"}
              value={formData.confirmar}
              onChange={handleConfirmChange}
              error={fieldErrors.confirmar}
            />

            <ShowPasswordToggle
              showPassword={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />

            {/* COMPONENTE REAL DE RECAPTCHA */}
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={(token) => {
                  setRecaptchaToken(token);
                  setLocalError(""); // Limpia el error en cuanto se marca
                }}
                onExpired={() => setRecaptchaToken(null)}
              />
            </div>

            <FormNavigation
              onBack={() => navigate("/")}
              onContinue={handleContinue}
              continueText={loading ? "Procesando..." : "Continuar"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep1Page;