import { useState } from "react";
import { validarCredenciales } from "../validations/authValidation";

export const useAuth = () => {
  const [credenciales, setCredenciales] = useState({
    usuario: "",
    password: "",
  });

  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const handleCambiar = (e) => {
    const { id, value } = e.target;

    setCredenciales((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const toggleMostrarContraseña = () => {
    setMostrarContraseña((prev) => !prev);
  };

  const validarFormulario = () => {
    return validarCredenciales(credenciales);
  };

  return {
    credenciales,
    mostrarContraseña,
    handleCambiar,
    toggleMostrarContraseña,
    validarFormulario,
  };
};
