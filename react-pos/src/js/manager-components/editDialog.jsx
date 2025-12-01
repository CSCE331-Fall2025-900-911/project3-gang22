import { useState } from "react";
import "./managerStyles.css";

//Displays modal that contains passed fields for the user to edit and returns data for use
export default function EditDialog({ title, fields, initialValues = [], onSubmit, onClose, requiredFields, errorMessage }) {
  const [values, setValues] = useState(
    fields.map((_, i) => initialValues[i] ?? "")
  );

  function handleChange(index, newValue) {
    const updated = [...values];
    updated[index] = newValue;
    setValues(updated);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>{title}</h3>
        {errorMessage && (
            <div style={{ color: "red", marginBottom: "0.75rem" }}>{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          {fields.map((label, i) => (
            <div key={i} style={{ marginBottom: "0.5rem" }}>
              <label>{requiredFields.includes(i) ? "*" : ""}{label}: </label>
              <input
                type="text"
                // required={requiredFields.includes(i)}
                value={values[i]}
                onChange={(e) => handleChange(i, e.target.value)}
              />
            </div>
          ))}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}