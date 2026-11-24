const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };
    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      const data = await response.json();
      if (!response.ok)
        throw new ApiError(
          data.message || "Error en la petición",
          response.status,
          data,
        );
      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError("Error de conexión con el servidor", 500);
    }
  },

  createArchivo: (data) =>
    api.request("/archivos", { method: "POST", body: JSON.stringify(data) }),
  getArchivos: () => api.request("/archivos"),
  getArchivoById: (id) => api.request(`/archivos/${id}`),
  updateArchivo: (id, data) =>
    api.request(`/archivos/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteArchivo: (id) => api.request(`/archivos/${id}`, { method: "DELETE" }),

  login: (credentials) =>
    api.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  registerStep1: (data) =>
    api.request("/auth/register/step1", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  registerStep2: (userId, data) =>
    api.request(`/auth/register/step2/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  registerStep3: (userId, companyId) =>
    api.request(`/auth/register/step3/${userId}`, {
      method: "PUT",
      body: JSON.stringify({ companyId }),
    }),
  registerStep4: (userId, code) =>
    api.request(`/auth/register/step4/${userId}`, {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  resendCode: (userId) =>
    api.request(`/auth/register/resend/${userId}`, {
      method: "POST",
    }),

  getFiscalias: () => api.request("/auth/fiscalias"),
  getFiscaliaById: (id) => api.request(`/auth/fiscalias/${id}`),

  getAllEquipment: (search = "") =>
    api.request(
      `/equipment${search ? `?search=${encodeURIComponent(search)}` : ""}`,
    ),
  getEquipmentByType: (tipo, search = "") =>
    api.request(
      `/equipment/${tipo}${search ? `?search=${encodeURIComponent(search)}` : ""}`,
    ),
  addEquipment: (data) =>
    api.request("/equipment", { method: "POST", body: JSON.stringify(data) }),
  updateEquipment: (id, data) =>
    api.request(`/equipment/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  deleteEquipment: (tipo, ids) =>
    api.request(`/equipment/${tipo}`, {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    }),

  updateDeviceStatus: () => api.request("/ping/update", { method: "POST" }),
  scanRange: (ipInicio, ipFin) =>
    api.request("/scan/start", {
      method: "POST",
      body: JSON.stringify({ ipInicio, ipFin }),
    }),
};

export default api;
