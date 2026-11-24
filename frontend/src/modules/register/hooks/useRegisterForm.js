import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../context/useRegister";
import api from "../../../shared/services/api";

export const useRegisterForm = (initialData, step, nextRoute) => {
  const navigate = useNavigate();
  const { registerData, saveStepData, setUserId } = useRegister();
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;

    if (type === "checkbox") {
      processedValue = checked;
    } else if (["telefono", "telefono_personal", "codigoPostal"].includes(name)) {
      processedValue = value.replace(/\D/g, "");
    } else if (["primerNombre", "segundoNombre", "primerApellido", "segundoApellido", "ciudad"].includes(name)) {
      processedValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    setError("");
  };

  // Aceptamos el recaptchaToken como parámetro opcional (solo se usa en el paso 1)
  const handleSubmit = async (recaptchaToken = null) => {
    setError("");

    try {
      setLoading(true);
      saveStepData(step, formData);

      switch (step) {
        case 1: {
          // Armamos el payload con los datos y el token
          const step1Payload = {
            ...formData,
            recaptchaToken: recaptchaToken 
          };
          
          const step1Response = await api.registerStep1(step1Payload);
          setUserId(step1Response.data.id);
          break;
        }
        case 2:
          if (!registerData.userId) {
            throw new Error("No se encontró el ID de usuario. Regrese al paso 1.");
          }
          await api.registerStep2(registerData.userId, formData);
          break;
        case 3:
          if (!registerData.userId) {
            throw new Error("No se encontró el ID de usuario. Regrese al paso 1.");
          }
          await api.registerStep3(registerData.userId, formData.companiaId);
          await api.resendCode(registerData.userId);
          break;
        default:
          break;
      }

      navigate(nextRoute);
      return true; // Éxito
    } catch (err) {
      setError(err.message || "Error al procesar el formulario");
      return false; // Fallo (para reiniciar el captcha)
    } finally {
      setLoading(false);
    }
  };

  return { formData, setFormData, handleChange, handleSubmit, loading, error };
};