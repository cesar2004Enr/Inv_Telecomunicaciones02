import { useContext } from "react";
import { RegisterContext } from "./RegisterContext";

export const useRegister = () => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error("useRegister debe usarse dentro de un RegisterProvider");
  }
  return context;
};
