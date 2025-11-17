import React from "react";
import DatePicker from "./datepicker.jsx";

export default function RangeDateToolbar({ selectedDate, setSelectedDate, viewRange, setViewRange }) {
  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", alignItems: "center" }}>
      <button onClick={() => setViewRange("day")} className={viewRange === "day" ? "active" : ""}>Day</button>
      <button onClick={() => setViewRange("week")} className={viewRange === "week" ? "active" : ""}>Week</button>
      <button onClick={() => setViewRange("month")} className={viewRange === "month" ? "active" : ""}>Month</button>
      <button onClick={() => setViewRange("year")} className={viewRange === "year" ? "active" : ""}>Year</button>
      <DatePicker label="Select Date: " value={selectedDate} onChange={setSelectedDate} />
    </div>
  );
}