import styles from "../styles/register.module.css";

const CaptchaCheckbox = ({ checked, onChange }) => {
  return (
    <div className={styles.ejemploCaptcha}>
      <div className={styles.contenedorCaptcha}>
        <input
          type="checkbox"
          name="noSoyRobot"
          checked={checked}
          onChange={onChange}
          id="robot"
        />
        <label htmlFor="robot">No soy un robot</label>
        <img
          src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
          alt="captcha"
          width="30"
        />
      </div>
    </div>
  );
};

export default CaptchaCheckbox;
