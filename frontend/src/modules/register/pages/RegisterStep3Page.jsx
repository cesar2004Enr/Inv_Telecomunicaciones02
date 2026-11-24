import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterForm } from "../hooks/useRegisterForm";
import { validateStep3 } from "../validations/authValidation";
import {
  INITIAL_STEP3_DATA,
  APP_TITLE,
  MEXICAN_STATES,
  CITIES,
} from "../constants/registerConstants";
import api from "../../../shared/services/api";
import StepIndicator from "../components/StepIndicator";
import FormField from "../components/FormField";
import FormNavigation from "../components/FormNavigation";
import styles from "../styles/register.module.css";
import RegisterHeader from "../components/RegisterHeader";

const STEPS = ["Cuenta", "Información", "Fiscalía", "Verificación"];

const RegisterStep3Page = () => {
  const navigate = useNavigate();
  const { formData, handleChange, handleSubmit, loading, error } =
    useRegisterForm(INITIAL_STEP3_DATA, 3, "/registro-4");
  const [fiscalias, setFiscalias] = useState([]);
  const [loadingFiscalias, setLoadingFiscalias] = useState(false);

  // Efecto de cascada: solo cargar fiscalías si País, Estado y Ciudad están seleccionados
useEffect(() => {
  let cancelled = false;

  const loadFiscalias = async () => {
    // Limpiar fiscalías si los campos previos cambian
    setFiscalias([]);
    handleChange({ target: { name: "companiaId", value: "" } });
    // ... limpiar otros campos ...

    // Si no hay país, estado o ciudad, no buscar
    if (!formData.pais || !formData.estado || !formData.ciudad) return;

    try {
      setLoadingFiscalias(true);
      const response = await api.getFiscalias();
      
      if (!cancelled) {
        // Filtrar por estado y ciudad
        const filtered = (response.data || []).filter(
          (f) => f.estado === formData.estado && f.ciudad === formData.ciudad
        );
        
        console.log("Fiscalías recibidas:", response.data);
        console.log("Filtradas:", filtered);
        
        setFiscalias(filtered);
      }
    } catch (err) {
      console.error("Error al cargar fiscalías:", err);
    } finally {
      if (!cancelled) setLoadingFiscalias(false);
    }
  };

  loadFiscalias();

  return () => {
    cancelled = true;
  };
}, [formData.pais, formData.estado, formData.ciudad]);

  const handleFiscaliaChange = async (e) => {
    const fiscaliaId = e.target.value;

    handleChange({
      target: { name: "companiaId", value: fiscaliaId },
    });

    if (!fiscaliaId) {
      ["companiaNombre", "calle", "numeroExterior", "numeroInterior", "colonia", "telefono", "codigoPostal"].forEach(
        (field) => handleChange({ target: { name: field, value: "" } })
      );
      return;
    }

    try {
      const response = await api.getFiscaliaById(fiscaliaId);
      const f = response.data;

      handleChange({ target: { name: "companiaNombre", value: f.nombreEmpresa } });
      handleChange({ target: { name: "calle", value: f.calle } });
      handleChange({ target: { name: "numeroExterior", value: f.numeroExterior } });
      handleChange({ target: { name: "numeroInterior", value: f.numeroInterior || "" } });
      handleChange({ target: { name: "colonia", value: f.colonia } });
      handleChange({ target: { name: "telefono", value: f.telefonoEmpresa } });
      handleChange({ target: { name: "codigoPostal", value: f.codigoPostal } });
    } catch (err) {
      console.error("Error al cargar detalles:", err);
    }
  };

  const handleContinue = () => {
    const validation = validateStep3(formData);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }
    handleSubmit();
  };

  // Determinar qué opciones están habilitadas
  const isPaisSelected = !!formData.pais;
  const isTabascoSelected = formData.estado === "Tabasco";
  const isVillahermosaSelected = formData.ciudad === "Villahermosa";

  // Ciudades disponibles (solo si es Tabasco)
  const availableCities = isTabascoSelected ? CITIES : [];

  return (
    <div className={styles.fondo}>
      <RegisterHeader />

      <div className={styles.contenedorDatos}>
        <div className={styles.formularioGeneral}>
          <StepIndicator steps={STEPS} currentStep={3} />

          <div className={styles.cuerpoFormulario}>
            {error && (
              <div style={{ color: "red", backgroundColor: "#ffe6e6", padding: "10px", borderRadius: "5px", marginBottom: "15px", fontSize: "14px" }}>
                {error}
              </div>
            )}

            {/* País */}
            <FormField
              label="País"
              name="pais"
              value={formData.pais}
              onChange={handleChange}
              options={["México"]}
            />

            {/* Estado (deshabilitado hasta seleccionar país) */}
            <div className={styles.entredaDatos}>
              <label>Estado:</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className={styles.cuadroEntrada}
                disabled={!isPaisSelected}
              >
                <option value="">
                  {!isPaisSelected ? "Seleccione un país primero" : "Seleccione un estado"}
                </option>
                {isPaisSelected &&
                  MEXICAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
              </select>
            </div>

            {/* Ciudad (deshabilitada hasta seleccionar Tabasco) */}
            <div className={styles.entredaDatos}>
              <label>Ciudad:</label>
              <select
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className={styles.cuadroEntrada}
                disabled={!isTabascoSelected}
              >
                <option value="">
                  {!isTabascoSelected ? "Seleccione el estado de Tabasco" : "Seleccione una ciudad"}
                </option>
                {availableCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Fiscalía (deshabilitada hasta seleccionar Villahermosa) */}
            <div className={styles.entredaDatos}>
              <label>Fiscalía:</label>
              <select
                name="companiaId"
                value={formData.companiaId}
                onChange={handleFiscaliaChange}
                className={styles.cuadroEntrada}
                disabled={!isVillahermosaSelected || loadingFiscalias || fiscalias.length === 0}
              >
                <option value="">
                  {!isVillahermosaSelected
                    ? "Seleccione la ciudad de Villahermosa"
                    : loadingFiscalias
                    ? "Cargando fiscalías..."
                    : fiscalias.length === 0
                    ? "No hay fiscalías disponibles"
                    : "Seleccione una fiscalía"}
                </option>
                {fiscalias.map((f) => (
                  <option key={f.id} value={f.id}>{f.nombreEmpresa}</option>
                ))}
              </select>
            </div>

            {/* Campos auto-llenados (solo lectura) */}
            <FormField label="Calle" name="calle" value={formData.calle} onChange={handleChange} placeholder="Seleccione una fiscalía" disabled={true} />
            <FormField label="Número Exterior" name="numeroExterior" value={formData.numeroExterior} onChange={handleChange} placeholder="Seleccione una fiscalía" disabled={true} />
            <FormField label="Número Interior" name="numeroInterior" value={formData.numeroInterior} onChange={handleChange} placeholder="Opcional" disabled={!formData.companiaId} />
            <FormField label="Colonia" name="colonia" value={formData.colonia} onChange={handleChange} placeholder="Seleccione una fiscalía" disabled={true} />
            <FormField label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Seleccione una fiscalía" disabled={true} />
            <FormField label="Código Postal" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} placeholder="Seleccione una fiscalía" disabled={true} />

            <FormNavigation
              onBack={() => navigate("/registro-2")}
              onContinue={handleContinue}
              continueText={loading ? "Procesando..." : "Continuar"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStep3Page;