import styles from "../styles/register.module.css";

const FormNavigation = ({
  onBack,
  onContinue,
  backText = "Regresar",
  continueText = "Continuar",
  extraButton = null,
}) => {
  return (
    <div className={styles.botones}>
      {onBack && (
        <button type="button" className={styles.btnRegresar} onClick={onBack}>
          {backText}
        </button>
      )}
      {extraButton}
      <button
        type="button"
        className={styles.btnContinuar}
        onClick={onContinue}
      >
        {continueText}
      </button>
    </div>
  );
};

export default FormNavigation;
