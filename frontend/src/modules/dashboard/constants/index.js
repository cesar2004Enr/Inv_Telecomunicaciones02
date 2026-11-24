export const APP_TITLE = "Inventario de Infraestructura de telecomunicaciones";

export const NAV_ITEMS = [
  { icon: "home", label: "Inicio", path: "/dashboard" },
  { icon: "monitor_heart", label: "Equipos", path: null },
  { icon: "radar", label: "Escaneo", path: "/dashboard/escaneo" },
  { icon: "report", label: "Actividades", path: "/dashboard/actividades" },
  { icon: "folder", label: "Archivos", path: "/dashboard/archivos" },
];

export const STATS = [
  { label: "Total equipos", val: 510 },
  { label: "Equipos activos", val: 400 },
];

export const TABLE_HEADERS = [
  "Id",
  "Nombre",
  "IPv4",
  "Marca",
  "Serie",
  "Sitio",
  "Estado",
  "",
];

export const MOCK_USER = {
  nombre: "Nombre Ejemplo",
  email: "correoejmplo@gmail.com",
};
