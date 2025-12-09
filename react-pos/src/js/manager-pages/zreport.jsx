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

  // Default date = today
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setReportDate(today);
  }, []);

  // Check if Z report exists for the date
  useEffect(() => {
    if (!reportDate) return;

    fetch(`${MANAGER_BASE_URL}/z_report?date=${reportDate}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setZReportDone(true);
        } else {
          setZReportDone(false);
        }
        // Always load X report for chart + table
        loadXReportData(reportDate);
      })
      .catch(err => {
        console.error("Z-report check failed:", err);
        setZReportDone(false);
        loadXReportData(reportDate);
      });
  }, [reportDate]);

  // Load X report data (per-hour breakdown)
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

  // Generate Z report (aggregate totals from X report)
  function generateZReport() {
    const now = new Date();
    const todatStr = now.toISOString().split("T")[0]; // "YYYY-MM-DD"
    if (reportDate == todatStr && now.getHours() < 21) {
      if (!window.confirm("It’s before 9:00 PM. Generating a Z-Report may cause incomplete totals. Continue?")) {
        return;
      }
    }

    const totals = tableData.reduce(
      (acc, row) => {
        acc.total_sales += Number(row.sales) || 0;
        acc.total_returns += Number(row.returns) || 0;
        acc.total_voids += Number(row.voids) || 0;
        acc.total_discards += Number(row.discards) || 0;
        acc.total_cash += Number(row.cash) || 0;
        acc.total_card += Number(row.card) || 0;
        acc.total_other += Number(row.other) || 0;
        return acc;
      },
      {
        total_sales: 0,
        total_returns: 0,
        total_voids: 0,
        total_discards: 0,
        total_cash: 0,
        total_card: 0,
        total_other: 0
      }
    );

    fetch(`${MANAGER_BASE_URL}/z_report/add`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_date: reportDate, ...totals })
    })
      .then(res => res.json())
      .then(() => {
        // REMOVE THE ALERT
        alert(`Z-Report generated for ${reportDate}`);
        setZReportDone(true);
      })
      .catch(err => console.error("Z-report generation failed:", err));
  }

  return (
    <div style={{ marginLeft: "20px"}}>
      <h2>X & Z Report</h2>

      <div style={{ marginBottom: "1rem" }}>
        <DatePicker label="Report Date: " value={reportDate} onChange={setReportDate} />
      </div>

      {/* Always show X report chart + table */}
      <Chart title="Sales per Hour" xaxis="x" yaxis="y" data={chartData} yRangePadding={1000} xLabel="Hour" yLabel="Revenue ($)"/>
      <Table headers={XREPORT_HEADERS} data={tableData} />

      <button onClick={generateZReport} disabled={zReportDone}>
        {zReportDone ? "Z Report Finalized" : "Generate Z Report"}
      </button>
    </div>
  );
}