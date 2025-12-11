import { useState, useEffect, useRef } from "react";
import "./managerStyles.css";

export default function EditDialog({
  title,
  fields,
  initialValues = [],
  onSubmit,
  onClose,
  requiredFields = [],
  errorMessage,
  extraFields = null,
  allCustomizationGroups = [],
  customizationGroups = ""   // ✅ string of groups passed from Editor
}) {
  const [values, setValues] = useState(fields.map((_, i) => initialValues[i] ?? ""));
  const [selectedGroups, setSelectedGroups] = useState(
    customizationGroups
      ? customizationGroups.split(",").map(g => g.trim())
      : []
  );

  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.focus();
    }
  }, []);

  function handleChange(index, newValue) {
    const updated = [...values];
    updated[index] = newValue;
    setValues(updated);
  }

  function toggleGroup(group) {
    setSelectedGroups(prev =>
      prev.includes(group)
        ? prev.filter(g => g !== group)
        : [...prev, group]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Pass both normal values and customization groups back
    onSubmit({ values, customization_groups: selectedGroups });
  }

  // Trap focus inside dialog
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
    if (e.key === "Tab") {
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <div className="dialog-overlay">
      <div
        className="dialog-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-dialog-title"
        ref={dialogRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <h3 id="edit-dialog-title">{title}</h3>

        {errorMessage && (
          <div role="alert" className="dialog-error">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((label, i) => {
            const inputId = `edit-field-${i}`;
            const isRequired = requiredFields.includes(i);
            return (
              <div key={i} className="dialog-field">
                <label htmlFor={inputId}>{isRequired ? "*" : ""}{label}: </label>
                <input
                  id={inputId}
                  type="text"
                  value={values[i]}
                  onChange={(e) => handleChange(i, e.target.value)}
                  required={isRequired}
                  aria-required={isRequired}
                />
              </div>
            );
          })}

          {/* Render extra fields if provided (e.g. customization checkboxes for MenuPage) */}
          {extraFields && extraFields(allCustomizationGroups, selectedGroups, toggleGroup)}

          <div className="dialog-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} aria-label="Cancel editing dialog">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}