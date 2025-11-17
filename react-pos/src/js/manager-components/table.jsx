import React from "react";

// Dynamically populates table with passed in headers and data
export default function Table({ headers, data }) {
  return (
    <table className="menu">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header.display}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data) ? data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>
                  {header.render ? header.render(row) : row[header.key]}
                </td>
              ))}
            </tr>
          ))
          : null}
      </tbody>
    </table>
  );
}
