import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Graph({ xaxis, yaxis, data, xLabel = "X-Axis", yLabel = "Y-Axis" }) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis 
        dataKey={xaxis} 
        label={{ value: xLabel, position: "insideBottom", offset: -5 }} 
      />
      <YAxis 
        label={{ value: yLabel, angle: -90, position: "insideLeft" }} 
      />
      <Tooltip />
      <Legend 
        verticalAlign="bottom" 
        align="center" 
        wrapperStyle={{ paddingTop: 15 }} 
      />
      <Line type="monotone" dataKey={yaxis} stroke="#000000ff" />
    </LineChart>
  );
}
