import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function BarGraph({
  xaxis,
  yaxis,
  data,
  xLabel = "X-Axis",
  yLabel = "Y-Axis",
  width = 600,
  height = 300,
  barColor = "#8884d8"
}) {
  return (
    <BarChart width={width} height={height} data={data}
        margin={{ top: 20, right: 30, left: 60, bottom: 80 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey={xaxis}
        label={{ value: xLabel, position: "insideBottom", offset: -5 }}
        interval={0}
        angle={-45}
        height={80}
        textAnchor="end"
      />
      <YAxis
        label={{ value: yLabel, angle: -90, position: "insideLeft", offset: -20, dy:50 }}
      />
      <Tooltip />
      <Legend
        verticalAlign="top"
        align="center"
        wrapperStyle={{marginTop: -10}}
      />
      <Bar dataKey={yaxis} fill={barColor} />
    </BarChart>
  );
}