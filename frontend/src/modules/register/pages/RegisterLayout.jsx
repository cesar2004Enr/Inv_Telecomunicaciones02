import { Outlet } from "react-router-dom";
import { RegisterProvider } from "../context/RegisterProvider";

const RegisterLayout = () => (
  <RegisterProvider>
    <Outlet />
  </RegisterProvider>
);

export default RegisterLayout;
