import { useState } from "react";
import { RegisterContext } from "./RegisterContext";

export const RegisterProvider = ({ children }) => {
  const [registerData, setRegisterData] = useState({
    userId: null,
    step1: null,
    step2: null,
    step3: null,
  });

  const saveStepData = (step, data) => {
    setRegisterData((prev) => ({ ...prev, [step]: data }));
  };

  const setUserId = (userId) => {
    setRegisterData((prev) => ({ ...prev, userId }));
  };

  const value = { registerData, saveStepData, setUserId };

  return (
    <RegisterContext.Provider value={value}>
      {children}
    </RegisterContext.Provider>
  );
};
