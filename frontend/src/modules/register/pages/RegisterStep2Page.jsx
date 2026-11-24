import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { validateStep2, validateName } from "../validations/authValidation";
import { INITIAL_STEP2_DATA, APP_TITLE } from "../constants/registerConstants";
import StepIndicator from "../components/StepIndicator";
import FormField from "../components/FormField";
import FormNavigation from "../components/FormNavigation";
import styles from "../styles/register.module.css";
import RegisterHeader from "../components/RegisterHeader";

const STEPS = ["Cuenta", "Información", "Fiscalía", "Verificación"];

const RegisterStep2Page = () => {
  const navigate = useNavigate();
  const { formData, handleChange, handleSubmit, loading, error } =
    useRegisterForm(INITIAL_STEP2_DATA, 2, "/registro-3");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleNameChange = (e) => {
    handleChange(e);
    const { name, value } = e.target;

    if (value.trim()) {
      const validation = validateName(
        value,
        name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
      );
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validation.isValid ? "" : validation.message,
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePhoneChange = (e) => {
    handleChange(e);
    const { value } = e.target;

    if (value && value.length === 10) {
      setFieldErrors((prev) => ({ ...prev, telefono: "" }));
    } else if (value && value.length > 0 && value.length < 10) {
      setFieldErrors((prev) => ({
        ...prev,
        telefono: "El teléfono debe tener exactamente 10 dígitos.",
      }));
    } else {
      setFieldErrors((prev) => ({ ...prev, telefono: "" }));
    }
  };

  const handleContinue = () => {
    const validation = validateStep2(formData);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }
    handleSubmit();
  };

  const fieldLabels = {
    primerNombre: "Primer Nombre",
    segundoNombre: "Segundo Nombre",
    primerApellido: "Primer Apellido",
    segundoApellido: "Segundo Apellido",
  };

  return (
    <div className={styles.fondo}>
      <RegisterHeader />

      <div className={styles.contenedorDatos}>
        <div className={styles.formularioGeneral}>
          <StepIndicator steps={STEPS} currentStep={2} />

          <div className={styles.cuerpoFormulario}>
            {error && (
              <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "14px" }}>
                {error}
              </div>
            )}

            {["primerNombre", "segundoNombre", "primerApellido", "segundoApellido"].map((field) => (
              <FormField
                key={field}
                label={fieldLabels[field]}
                name={field}
                value={formData[field]}
                onChange={handleNameChange}
                placeholder={`Ingrese ${fieldLabels[field].toLowerCase()}`}
                maxLength={10}
                helpText={field === "primerNombre" || field === "primerApellido" ? "Obligatorio. Mínimo 3 letras, máximo 10 letras." : "Opcional. Si ingresa, mínimo 3 letras, máximo 10 letras."}
                error={fieldErrors[field]}
              />
            ))}

            <FormField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handlePhoneChange}
              placeholder="5512345678"
              maxLength={10}
              helpText="Obligatorio. 10 dígitos exactos."
              error={fieldErrors.telefono}
            />

            <FormNavigation
              onBack={() => navigate("/registro-1")}
              onContinue={handleContinue}
              continueText={loading ? "Procesando..." : "Continuar"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep2Page;