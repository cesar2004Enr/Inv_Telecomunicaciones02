import { useRef } from "react";
import styles from "../styles/equipos.module.css";

const OctetInput = ({ value, onChange, label }) => {
  const inputRef0 = useRef(null);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const inputRefs = [inputRef0, inputRef1, inputRef2, inputRef3];

  const octets = value ? value.split(".") : ["", "", "", ""];

  const handleOctetChange = (index, e) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length > 3) return;

    const newOctets = [...octets];
    newOctets[index] = val;
    const newValue = newOctets.join(".");

    const fieldName = label === "IPv4" ? "direccionIpv4" : "mascaraSubred";
    onChange({ target: { name: fieldName, value: newValue } });

    if (val.length === 3 && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !octets[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <div className={styles.octetContainer}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{ display: "flex", alignItems: "center" }}>
          <input
            ref={inputRefs[i]}
            type="text"
            className={styles.octetInput}
            value={octets[i] || ""}
            onChange={(e) => handleOctetChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            maxLength={3}
            placeholder="0"
            inputMode="numeric"
          />
          {i < 3 && <span className={styles.octetDot}>.</span>}
        </span>
      ))}
    </div>
  );
};

export default OctetInput;
