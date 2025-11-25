import { useEffect, useState } from "react";
import Chart from "../manager-components/chart.jsx";
import Table from "../manager-components/table.jsx";
import DatePicker from "../manager-components/datepicker.jsx";
import { MANAGER_BASE_URL } from "../manager";

export default function ZReportPage() {
  const [reportDate, setReportDate] = useState("");
  const [chartData, setChartData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [zReportDone, setZReportDone] = useState(false);

  const ZREPORT_HEADERS = [
    { display: "Hour", key: "label" },
    { display: "Sales", key: "sales" },
    { display: "Returns", key: "returns" },
    { display: "Voids", key: "voids" },
    { display: "Discards", key: "discards" },
    { display: "Cash", key: "cash" },
    { display: "Card", key: "card" },
    { display: "Other", key: "other" }
  ];

  // Default date = today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setReportDate(today);
  }, []);

  // Check if Z-report already exists
  useEffect(() => {
    if (!reportDate) return;
    fetch(`${MANAGER_BASE_URL}/z_report/check?date=${reportDate}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setZReportDone(data.exists);
        if (data.exists) {
          loadXReportData(reportDate);
        }
      })
      .catch(err => console.error("Check Z-report failed:", err));
  }, [reportDate]);

  // Load X-report data (chart + table)
  function loadXReportData(date) {
    fetch(`${MANAGER_BASE_URL}/x_report?range=day&dateStr=${date}&dateFormat=HH12 AM`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        const series = data.map(record => ({ x: record.label, y: record.total_sales }));
        setChartData(series);

        const normalized = data.map(record => ({
          label: record.label,
          sales: record.total_sales,
          returns: 0,
          voids: 0,
          discards: 0,
          cash: 0,
          card: record.total_sales,
          other: 0
        }));
        setTableData(normalized);
      })
      .catch(err => console.error("X-report fetch failed:", err));
  }

  // Generate Z-report
  function generateZReport() {
    // ⚠️ Warn if before 9 PM
    const now = new Date();
    if (now.getHours() < 21) {
      if (!window.confirm("It’s before 9:00 PM. Generating a Z-Report may cause incomplete totals. Continue?")) {
        return;
      }
    }

    // Step 1: Load X-report data
    loadXReportData(reportDate);

    // Step 2: Aggregate totals
    const totals = tableData.reduce(
      (acc, row) => {
        acc.sales += row.sales;
        acc.returns += row.returns;
        acc.voids += row.voids;
        acc.discards += row.discards;
        acc.cash += row.cash;
        acc.card += row.card;
        acc.other += row.other;
        return acc;
      },
      { sales: 0, returns: 0, voids: 0, discards: 0, cash: 0, card: 0, other: 0 }
    );

    // Step 3: Send to backend
    fetch(`${MANAGER_BASE_URL}/z_report/add`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: reportDate, ...totals })
    })
      .then(res => res.json())
      .then(() => {
        alert(`Z-Report generated for ${reportDate}\nX-report table reset.`);
        setZReportDone(true);
      })
      .catch(err => console.error("Z-report generation failed:", err));
  }

  return (
    <>
      <h2>Z Report</h2>

      <div style={{ marginBottom: "1rem" }}>
        <DatePicker label="Report Date: " value={reportDate} onChange={setReportDate} />
      </div>

      <Chart title="Sales per Hour" xaxis="x" yaxis="y" data={chartData} yRangePadding={1000} />
      <Table headers={ZREPORT_HEADERS} data={tableData} />

      <button onClick={generateZReport} disabled={zReportDone}>
        Generate Z-Report
      </button>
    </>
  );
}