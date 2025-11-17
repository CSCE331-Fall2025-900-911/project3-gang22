import React from "react";

export default function DatePicker({ label, value, onChange, disabled = false }) {
  return (
    <div className="datepicker-container">
      {label && <label className="datepicker-label">{label}</label>}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
