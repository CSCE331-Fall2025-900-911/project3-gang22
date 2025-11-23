import { useEffect, useState } from "react";
import Chart from "../manager-components/chart.jsx";
import Table from "../manager-components/table.jsx";
import DatePicker from "../manager-components/datepicker.jsx";
import { MANAGER_BASE_URL } from "../manager";

export default function XReportPage() {
  const [reportDate, setReportDate] = useState("");
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const XREPORT_HEADERS = [
    { display: "Hour", key: "label" },
    { display: "Sales", key: "sales" },
    { display: "Returns", key: "returns" },
    { display: "Voids", key: "voids" },
    { display: "Discards", key: "discards" },
    { display: "Cash", key: "cash" },
    { display: "Card", key: "card" },
    { display: "Other", key: "other" }
  ];

  // Set default date to today on first load
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setReportDate(today);
  }, []);

  // Fetch chart and table data when reportDate changes
  useEffect(() => {
    if (!reportDate) return;

    // Chart data
    fetch(`${MANAGER_BASE_URL}/xreport-chart?date=${reportDate}`)
      .then(res => res.json())
      .then(data => {
        const series = data.map(record => ({
          x: record.label,
          y: record.sales
        }));
        setChartData(series);
      })
      .catch(err => {
        console.error("Chart fetch failed:", err);
        setChartData([]);
      });

    // Table data
    fetch(`${MANAGER_BASE_URL}/xreport-table?date=${reportDate}`)
      .then(res => res.json())
      .then(data => {
        setTableData(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error("Table fetch failed:", err);
        setTableData([]);
      });
  }, [reportDate]);

  return (
    <>
      <h2>X Report</h2>

      {/* Date Picker */}
      <div style={{ marginBottom: "1rem" }}>
        <DatePicker label="Report Date: " value={reportDate} onChange={setReportDate} />
      </div>

      {/* Chart */}
      <Chart title="Sales per Hour" xaxis="x" yaxis="y" data={chartData} yRangePadding={1000} />

      {/* Table */}
      <Table headers={XREPORT_HEADERS} data={tableData} />
    </>
  );
}