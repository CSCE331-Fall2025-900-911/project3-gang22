import { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";

export default function EmployeePage() {

  const [ employeeItems , setEmployeeItems ] = useState([]);

    const EMPLOYEE_HEADERS = [
      { display: "Employee ID", key: "id" },
      { display: "Name", key: "name" },
      { display: "Role", key: "role" },
      { display: "Schedule", key: 'schedule'},
    ];

  // Fetches employee data from backend when component is mounted and stores it for use inside the table
  useEffect(() => {
    async function getEmployees() {
      try {
        const response = await fetch("https://project3-gang22-backend.onrender.com/api/managers/employee");
        const data = await response.json();
        setEmployeeItems(data);                           
      } catch (err) {
        console.error("Error fetching menu:", err);
      }
    }
    getEmployees();
  }, []); 

  // Returns table containing stored employee data
  return (
    <div className="page-content-container">
      <div className="header-row">
        {EMPLOYEE_HEADERS.map((header) => (
          <p key={header.key}>{header.display}</p>
        ))}
      </div>
      <Virtuoso
        data={employeeItems}
        itemContent={(index, item) => (
          <div className="grid-row">
            <p>{item.id}</p>
            <p>{item.name}</p>
            <p>{item.role}</p>
            <p>{item.schedule}</p>
          </div>
        )}
      />
    </div>
  )
}
