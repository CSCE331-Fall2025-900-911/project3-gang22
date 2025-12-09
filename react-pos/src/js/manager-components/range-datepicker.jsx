import React from "react";
import DatePicker from "./datepicker.jsx";
import "./managerStyles.css";

// Helper component for a single range button
function RangeButton({ label, value, viewRange, setViewRange }) {
  return (
    <button
      onClick={() => setViewRange(value)}
      className={`range-btn ${viewRange === value ? "active" : ""}`}
    >
      {label}
    </button>
  );
}


//Displays buttons that allows the user to change the selected date or range of dates
export default function RangeDateToolbar({ selectedDate, setSelectedDate, viewRange, setViewRange }) {
  return (
    <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem", alignItems: "center" }}>
      <RangeButton label="Day" value="day" viewRange={viewRange} setViewRange={setViewRange} />
      <RangeButton label="Week" value="week" viewRange={viewRange} setViewRange={setViewRange} />
      <RangeButton label="Month" value="month" viewRange={viewRange} setViewRange={setViewRange} />
      <RangeButton label="Year" value="year" viewRange={viewRange} setViewRange={setViewRange} />
      <DatePicker label="Select Date: " value={selectedDate} onChange={setSelectedDate} />
    </div>
  );
}