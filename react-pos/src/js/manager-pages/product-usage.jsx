import React, { useState, useEffect } from "react";
import DatePicker from "../manager-components/datepicker.jsx";
import Chart from "../manager-components/chart.jsx";
import Table from "../manager-components/table.jsx";
import RangeDateToolbar from "../manager-components/range-datepicker.jsx";
import { MANAGER_BASE_URL } from "../manager";

export default function ProductUsagePage() {
    const [selectedDate, setSelectedDate] = useState("");
    const [viewRange, setViewRange] = useState("day");
    const [usageData, setUsageData] = useState([]);
    const [detailedData, setDetailedData] = useState([]);

    const USAGE_HEADERS = [
        { display: "Item", key: "item_name" },
        { display: "Quantity Used", key: "quantity_used" },
    ];
    const DETAIL_HEADERS = [
        { display: "Item", key: "item_name" },
        { display: "Quantity Used", key: "quantity_used" },
        { display: "Cost Estimate", key: "estimated_cost" },
    ];

    useEffect(() => {
        if (selectedDate && viewRange) {
        getUsageData(viewRange, selectedDate);
        }
    }, [selectedDate, viewRange]);

    async function getUsageData(range, date) {
        try {
        const response = await fetch(`${MANAGER_BASE_URL}/product-usage?range=${encodeURIComponent(range)}&date=${encodeURIComponent(date)}`, {credentials: 'include'});
        const data = await response.json();
        setUsageData(data);
        } catch (err) {
        console.error("Error fetching usage data:", err);
        }
    }

    //Returns a chart and table containing product usage data
    return (
        <div style={{ marginLeft: "20px"}}>
        <h2>Inventory Usage Report</h2>

        {/* Toolbar */}
        <RangeDateToolbar selectedDate={selectedDate} setSelectedDate={setSelectedDate} viewRange={viewRange} setViewRange={setViewRange}/>

        {/* Chart + Summary Table */}
        <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
            <div style={{ flex: 2 }}>
            <Chart xaxis="item_name" yaxis="quantity_used" data={usageData} />
            </div>
            <div style={{ flex: 1 }}>
            <Table headers={USAGE_HEADERS} data={usageData} />
            </div>
        </div>

        {/* Detail Table */}
        <h3 style={{ marginTop: "2rem" }}>Detailed Usage Records</h3>
        <Table headers={DETAIL_HEADERS} data={usageData} />
        </div>
    );
}