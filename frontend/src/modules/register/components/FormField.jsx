import styles from "../styles/register.module.css";

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  options = null,
  placeholder = "",
  helpText = "",
  maxLength = null,
  error = "",
  disabled = false,
}) => {
  const renderInput = () => {
    if (options) {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${styles.cuadroEntrada} ${error ? styles.inputError : ""}`}
          disabled={disabled}
        >
          <option value="">Selecciona {label.toLowerCase()}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${styles.cuadroEntrada} ${error ? styles.inputError : ""}`}
        placeholder={placeholder}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={disabled}
      />
    );
  };

  return (
    <div className={styles.entredaDatos}>
      <label>
        {label}:
        {helpText && helpText.includes("Obligatorio") && (
          <span style={{ color: "#d32f2f", marginLeft: "4px" }}>*</span>
        )}
      </label>
      <div>
        {renderInput()}
        {helpText && !error && (
          <p
            style={{
              color: "#666",
              fontSize: "12px",
              marginTop: "5px",
              fontStyle: "italic",
            }}
          >
            {helpText}
          </p>
        )}
        {error && (
          <p
            style={{
              color: "#d32f2f",
              fontSize: "12px",
              marginTop: "5px",
              fontWeight: "500",
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormField;
