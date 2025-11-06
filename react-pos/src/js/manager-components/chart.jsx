import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function Graph({xaxis, yaxis, data}) {
  return (
    <LineChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xaxis} />
      <YAxis dataKey={yaxis}/>
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={yaxis}  stroke="#000000ff" />
    </LineChart>
  );
}
