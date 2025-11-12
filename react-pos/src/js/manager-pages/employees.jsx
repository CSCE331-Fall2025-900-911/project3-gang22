import { useEffect, useState } from "react";
import Table from "../manager-components/table";

export default function EmployeePage() {

  const [ employeeItems , setEmployeeItems ] = useState([]);

    const EMPLOYEE_HEADERS = [
      { display: "Employee ID", key: "id" },
      { display: "Name", key: "name" },
      { display: "Role", key: "role" },
      { display: "Schedule", key: 'schedule'},
    ];

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

  return (
    <Table headers={EMPLOYEE_HEADERS} data={employeeItems} />
  )
}
