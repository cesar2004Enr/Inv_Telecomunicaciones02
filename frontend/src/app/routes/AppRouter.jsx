import { Routes, Route, Navigate } from "react-router-dom";
import { RegisterProvider } from "../../modules/register/context/RegisterProvider";
import LandingPage from "../../modules/home/pages/LandingPage";
import LoginPage from "../../modules/auth/pages/LoginPage";
import RegisterStep1Page from "../../modules/register/pages/RegisterStep1Page";
import RegisterStep2Page from "../../modules/register/pages/RegisterStep2Page";
import RegisterStep3Page from "../../modules/register/pages/RegisterStep3Page";
import RegisterStep4Page from "../../modules/register/pages/RegisterStep4Page";
import DashboardPage from "../../modules/dashboard/pages/DashboardPage";
import DashboardHome from "../../modules/dashboard/pages/DashboardHome";
import RoutersPage from "../../modules/equipos/pages/RoutersPage";
import SwitchesPage from "../../modules/equipos/pages/SwitchesPage";
import TelefonosPage from "../../modules/equipos/pages/TelefonosPage";
import ImpresorasPage from "../../modules/equipos/pages/ImpresorasPage";
import ComputadorasPage from "../../modules/equipos/pages/ComputadorasPage";
import ScanPage from "../../modules/escaneo/pages/ScanPage";
import ActividadesPage from "../../modules/actividades/pages/ActividadesPage";
import ArchivosPage from "../../modules/archivos/pages/ArchivosPage";
import SpreadsheetPage from "../../modules/archivos/pages/SpreadsheetPage"; 
import FirewallsPage from "../../modules/equipos/pages/FirewallsPage";


const AppRouter = () => {
  return (
    <RegisterProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro-1" element={<RegisterStep1Page />} />
        <Route path="/registro-2" element={<RegisterStep2Page />} />
        <Route path="/registro-3" element={<RegisterStep3Page />} />
        <Route path="/registro-4" element={<RegisterStep4Page />} />

        <Route path="/dashboard" element={<DashboardPage />}>
          <Route index element={<DashboardHome />} />
          <Route path="routers" element={<RoutersPage />} />
          <Route path="switches" element={<SwitchesPage />} />
          <Route path="telefonos" element={<TelefonosPage />} />
          <Route path="impresoras" element={<ImpresorasPage />} />
          <Route path="computadoras" element={<ComputadorasPage />} />
          <Route path="firewalls" element={<FirewallsPage />} />
          <Route path="escaneo" element={<ScanPage />} />
          <Route path="actividades" element={<ActividadesPage />} />
          <Route path="archivos" element={<ArchivosPage />} />
          <Route path="archivos/nueva" element={<SpreadsheetPage />} />
          <Route path="archivos/editar/:id" element={<SpreadsheetPage />} /> 
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </RegisterProvider>
  );
};

export default AppRouter;
