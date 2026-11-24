import styles from "../styles/register.module.css";

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className={styles.contenedorPasos}>
      {steps.map((step, index) => (
        <div key={index} className={styles.stepWrapper}>
          <div
            className={`${styles.pasos} ${
              index < currentStep - 1
                ? styles.pasosCompletados
                : index === currentStep - 1
                  ? styles.active
                  : ""
            }`}
          >
            {index + 1}
            <span>{step}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`${styles.line} ${
                index < currentStep - 1 ? styles.lineActive : ""
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
