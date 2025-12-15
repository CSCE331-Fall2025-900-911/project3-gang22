import React from "react";

// This component displays a date picker that sets the selected data
export default function DatePicker({ label, value, onChange, disabled = false, id = "datepicker" }) {
  return (
    <div className="datepicker-container">
      {label && (
        <label className="datepicker-label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
