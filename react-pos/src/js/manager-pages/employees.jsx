import Editor from "../manager-components/editor";

export default function EmployeePage() {

  //Returns editor component containing employee information
  return (
    <Editor
      title="Employee"
      basePath="employee"
      fields={["Name", "Role"]}
      requiredFields={[0, 1]}
      numericFields={[1]}
      headers={[
        { display: "Employee ID", key: "id" },
        { display: "Name", key: "name" },
        { display: "Role", key: "role", render: (item) => (item.role == 0 ? "Customer" : "Manager")},
        // { display: "Schedule", key: "schedule" }
      ]}
      extractValues={(item) => [
        item.name,
        item.role,
        item.schedule
      ]}
      buildPayload={(values, id) => {
        let roleValue = values[1];
        // Convert human-friendly labels to numeric codes
        if (typeof roleValue === "string") {
          const normalized = roleValue.trim().toLowerCase();
          if (normalized === "customer") roleValue = 0;
          else if (normalized === "manager") roleValue = 1;
        }
        return {
          id,
          name: values[0],
          role: values[1],
          schedule: 0
        }
      }}
    />
  );
}
